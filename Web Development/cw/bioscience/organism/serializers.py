from rest_framework import serializers
from .models import *


class TaxonomySerializer(serializers.ModelSerializer):
    class Meta:
        model = Taxonomy
        fields = ['taxa_id', 'clade', 'genus', 'species']


class PfamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pfam
        fields = ['domain_id', 'family_description']


class DomainSerializer(serializers.ModelSerializer):
    pfam_id = PfamSerializer()

    class Meta:
        model = Domain
        fields = ['pfam_id', 'domain_description', 'start', 'end']


class ProteinSerializer(serializers.ModelSerializer):
    taxonomy = TaxonomySerializer()
    domains = DomainSerializer(many=True)

    class Meta:
        model = Protein
        fields = ['protein_id', 'sequence', 'taxonomy', 'length', 'domains']


class ViewProteinSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProteinDomainLink
        fields = ['protein', 'domains']
