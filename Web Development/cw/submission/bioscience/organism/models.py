from django.db import models


class Taxonomy(models.Model):
    taxa_id = models.IntegerField(null=False, blank=False)
    clade = models.CharField(
        max_length=256, null=False, blank=False)
    genus = models.CharField(
        max_length=256, null=False, blank=False)
    species = models.CharField(
        max_length=256, null=False, blank=False)


class Pfam(models.Model):
    domain_id = models.CharField(
        max_length=256, null=False, blank=False)
    domain_description = models.CharField(
        max_length=256, null=False, blank=False)


class Domain(models.Model):
    pfam_id = models.ForeignKey(
        Pfam, on_delete=models.DO_NOTHING)
    description = models.CharField(
        max_length=256, null=False, blank=False)
    start = models.IntegerField(null=False, blank=False)
    stop = models.IntegerField(null=False, blank=False)


class Protein(models.Model):
    protein_id = models.CharField(
        max_length=256, null=False, blank=False, unique=True)
    sequence = models.CharField(
        max_length=40000, null=True, blank=True)
    taxonomy = models.ForeignKey(Taxonomy, on_delete=models.DO_NOTHING)
    length = models.IntegerField(null=False, blank=False)
    domains = models.ManyToManyField(
        Domain, through='ProteinDomainLink', through_fields=('protein', 'domain'))


class ProteinDomainLink(models.Model):
    protein = models.ForeignKey(Protein, on_delete=models.DO_NOTHING)
    domain = models.ForeignKey(Domain, on_delete=models.DO_NOTHING)
