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
protein_domain = defaultdict(list)
taxonomy = set()
domain = set()
protein = defaultdict(list)
pfam = defaultdict(list)


with open(data_sequences_file) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    header = csv_reader.__next__()
    for row in csv_reader:
        protein[row[0]] = row[1]

with open(data_set_file) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    header = csv_reader.__next__()
    for row in csv_reader:
        organism_name = row[3].split(' ')
        taxonomy.add((row[1], row[2], organism_name[0], organism_name[1]))
        domain.add((row[4], row[5], row[6], row[7]))
        protein_domain[row[0]] = [row[1], *row[5]]

with open(pfam_descriptions_file) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    header = csv_reader.__next__()
    for row in csv_reader:
        pfam[row[0]] = row[1]

Protein.objects.all().delete()
Taxonomy.objects.all().delete()
Domain.objects.all().delete()
ProteinDomain.objects.all().delete()
Pfam.objects.all().delete()

protein_rows = {}
taxnomy_rows = {}
pfam_rows = {}
domain_rows = {}

for protein_id, entry in protein.items():
    row = Protein.objects.create(
        protein_id=protein_id, sequence=entry)
    row.save()
    protein_rows[entry] = row

for entry in taxonomy:
    row = Taxonomy.objects.create(
        taxa_id=entry[0], clade=entry[1], genus=entry[2], species=entry[3])
    row.save()
    taxnomy_rows[entry] = row

for domain_id, entry in pfam.items():
    row = Pfam.objects.create(
        domain_id=domain_id, family_description=entry)
    row.save()
    pfam_rows[domain_id] = row


for entry in domain:
    row = Domain.objects.create(
         domain_description=entry[0], start=entry[2], end=entry[3])
    row.update('domain_id',pfam_rows[entry[1]])
    row.save()
    domain_rows[entry] = row


# for protein_id, data in protein_domain.items():
#     row = ProteinDomain.objects.create(protein_id=protein_rows[protein_id], taxonomy_id=taxnomy_rows[data[1]])
#     row.save()


# def getDomain(domain_id, domain_description, start,end):
