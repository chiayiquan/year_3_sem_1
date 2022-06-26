from rest_framework import serializers
from .models import *


class TaxonomySerializer(serializers.ModelSerializer):
    class Meta:
        model = Taxonomy
        fields = ['taxa_id', 'clade', 'genus', 'species']


class PfamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pfam
        fields = ['domain_id', 'domain_description']


class DomainSerializer(serializers.ModelSerializer):
    pfam_id = PfamSerializer()

    class Meta:
        model = Domain
        fields = ['pfam_id', 'description', 'start', 'stop']


class ProteinSerializer(serializers.ModelSerializer):
    taxonomy = TaxonomySerializer()
    domains = DomainSerializer(many=True)

    class Meta:
        model = Protein
        fields = ['protein_id', 'sequence', 'taxonomy', 'length', 'domains']

    def create(self, validated_data):
        taxonomy_data = self.initial_data.get('taxonomy')
        domains_data = self.initial_data.get('domains')
        taxonomy = None
        domains_list = []

        if len(Taxonomy.objects.filter(taxa_id=taxonomy_data['taxa_id'])) > 0:
            taxonomy = Taxonomy.objects.filter(
                taxa_id=taxonomy_data['taxa_id'])[0]
        else:
            taxonomy = Taxonomy.objects.create(
                taxa_id=taxonomy_data['taxa_id'], clade=taxonomy_data['clade'], genus=taxonomy_data['genus'], species=taxonomy_data['species'])

        for domain in domains_data:
            pfam = Pfam.objects.filter(
                domain_id=domain['pfam_id']['domain_id'])

            if len(pfam) < 1:
                pfam = Pfam.objects.create(domain_id=domain['pfam_id']['domain_id'],
                                           domain_description=domain['pfam_id']['domain_description'])
            else:
                pfam = pfam[0]

            domain_obj = Domain.objects.create(
                pfam_id=pfam, description=domain['description'], start=domain['start'], stop=domain['stop'])
            domains_list.append(domain_obj)

        protein = Protein.objects.create(protein_id=validated_data['protein_id'],
                                         sequence=validated_data['sequence'],
                                         taxonomy=taxonomy,
                                         length=validated_data['length']
                                         )

        for domain_obj in domains_list:
            protein.domains.add(domain_obj)

        protein.save()
        return protein


class ListProteinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Protein
        fields = ['id', 'protein_id']


class ListPfamsSerializer(serializers.ModelSerializer):
    pfam_id = PfamSerializer()

    class Meta:
        model = Domain
        fields = ['id', 'pfam_id']
