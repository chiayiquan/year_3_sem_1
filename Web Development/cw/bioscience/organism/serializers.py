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


class ProteinDomainSerializer(serializers.ModelSerializer):
    taxonomy = TaxonomySerializer()
    # domains = DomainSerializer
    domains = serializers.SerializerMethodField()

    class Meta:
        model = ProteinDomain
        fields = ['protein_id', 'sequence', 'taxonomy', 'domains', 'length']

    def get_domains(self, instance):
        domains = instance.domains.all()
        return DomainSerializer([domains], many=True).data
