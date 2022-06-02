from rest_framework import serializers
from .models import *

from django.db.models import Sum, F


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


class CreateProteinSerializer(serializers.ModelSerializer):
    taxonomy = TaxonomySerializer()
    domains = DomainSerializer(many=True)

    class Meta:
        model = Protein
        fields = ['protein_id', 'sequence', 'taxonomy', 'length', 'domains']

    def create(self, validated_data):
        taxonomy_data = self.initial_data.get('taxonomy')
        domains_data = self.initial_data.get('domains')
        print([Domain.objects.get(pk=domain['id'])
              for domain in domains_data.keys()])
        protein = Protein(**{**validated_data,
                             'taxonomy': Taxonomy.objects.get(taxa_id=taxonomy_data['taxa_id']),
                             'domains': [Domain.objects.get(pfam_id=domain['pfam_id']) for domain in domains_data]
                             }
                          )
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


class CoverageSerializer(serializers.ModelSerializer):
    coverage = serializers.SerializerMethodField()

    class Meta:
        model = Protein
        fields = ['coverage']

    def get_coverage(self, instance):
        return Domain.objects.filter(
            protein=instance).annotate(start_total=Sum('start')).annotate(stop_total=Sum('stop')).annotate(coverage=(F('start_total') - F('stop_total'))/instance.length)
