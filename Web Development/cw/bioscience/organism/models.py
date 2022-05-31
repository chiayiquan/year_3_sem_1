from django.db import models


class Protein(models.Model):
    protein_id = models.CharField(max_length=256, null=False, blank=False)
    sequence = models.CharField(
        max_length=40000, null=True, blank=True)

    def __self__(self):
        return self.protein_id


class Taxonomy(models.Model):
    taxa_id = models.CharField(
        max_length=256, null=False, blank=False)
    clade = models.CharField(
        max_length=256, null=False, blank=False)
    genus = models.CharField(
        max_length=256, null=False, blank=False)
    species = models.CharField(
        max_length=256, null=False, blank=False)


class Pfam(models.Model):
    domain_id = models.CharField(max_length=256, null=False, blank=False)
    family_description = models.CharField(
        max_length=256, null=False, blank=False)

    def __str__(self):
        return self.domain_id


class Domain(models.Model):
    domain_id = models.ForeignKey(
        Pfam, on_delete=models.DO_NOTHING)
    domain_description = models.CharField(
        max_length=256, null=False, blank=False)
    start = models.IntegerField(null=False, blank=True)
    end = models.IntegerField(null=False, blank=True)


class ProteinDomain(models.Model):
    protein_id = models.ForeignKey(Protein, on_delete=models.DO_NOTHING)
    taxonomy_id = models.ForeignKey(Taxonomy, on_delete=models.DO_NOTHING)
    domains = models.ForeignKey(Domain, on_delete=models.DO_NOTHING)
    length = models.IntegerField(null=False, blank=True)
