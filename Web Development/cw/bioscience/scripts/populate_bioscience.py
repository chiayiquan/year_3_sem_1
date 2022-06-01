import os
import sys
import django
import csv
from collections import defaultdict

sys.path.append('./')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bioscience.settings')

django.setup()

from organism.models import *

data_sequences_file = './scripts/assignment_data_sequences.csv'
data_set_file = './scripts/assignment_data_set.csv'
pfam_descriptions_file = './scripts/pfam_descriptions.csv'
protein_domain = list()
taxonomy = set()
domain = set()
protein = defaultdict(list)
pfam = defaultdict(list)


with open(data_sequences_file) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for row in csv_reader:
        protein[row[0]] = row[1]

with open(data_set_file) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for row in csv_reader:
        organism_name = row[3].split(' ')
        taxonomy.add((row[1], row[2], organism_name[0], organism_name[1]))
        domain.add((row[4], row[5], row[6], row[7]))
        protein_domain.append([*row[0:2], *row[5:]])

with open(pfam_descriptions_file) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for row in csv_reader:
        pfam[row[0]] = row[1]

Taxonomy.objects.all().delete()
Domain.objects.all().delete()
ProteinDomain.objects.all().delete()
Pfam.objects.all().delete()

taxonomy_rows = {}
pfam_rows = {}
domain_rows = {}

for entry in taxonomy:
    row = Taxonomy.objects.create(
        taxa_id=entry[0], clade=entry[1], genus=entry[2], species=entry[3])
    row.save()
    taxonomy_rows[entry[0]] = row
print('Taxonomy inserted')

for domain_id, entry in pfam.items():
    row = Pfam.objects.create(
        domain_id=domain_id, family_description=entry)
    row.save()
    pfam_rows[domain_id] = row
print('Pfam inserted')


for entry in domain:
    row = Domain.objects.create(
        domain_description=entry[0], start=entry[2], end=entry[3], pfam_id=pfam_rows[entry[1]])
    row.save()
    unique_id=entry[1]+entry[2]+entry[3]
    domain_rows[unique_id] = row
print('Domain inserted')

for data in protein_domain:
    protein_id=data[0]
    row = ProteinDomain.objects.create(
        protein_id=protein_id, sequence=protein[protein_id], taxonomy=taxonomy_rows[data[1]], domains=domain_rows[data[2]+data[3]+data[4]], length=data[-1])
    row.save()
print('ProteinDomain inserted')

