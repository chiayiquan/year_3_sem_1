import json
from django.test import TestCase
from django.urls import reverse, reverse_lazy

from rest_framework.test import APIRequestFactory, APITestCase

from .model_factories import *
from .serializers import *


class GeneSerializerTest(APITestCase):
    gene1 = None
    geneserializer = None

    def setUp(self):
        self.gene1 = GeneFactory.create(pk=1, gene_id='gene1')
        self.geneserializer = GeneSerializer(instance=self.gene1)

    def tearDown(self):
        EC.objects.all().delete()
        Sequencing.objects.all().delete()
        Gene.objects.all().delete()
        ECFactory.reset_sequence(0)
        SequencingFactory.reset_sequence(0)
        GeneFactory.reset_sequence(0)

    def test_geneSerializer(self):
        data = self.geneserializer.data
        self.assertEqual(set(data.keys()), set(
            ['gene_id', 'sequencing', 'sense', 'start', 'stop', 'entity', 'ec', 'start_codon']))
        
    
    def test_geneSerializerGeneIDHasCorrectData(self):
        data = self.geneserializer.data
        self.assertEqual(data['gene_id'], 'gene1')


class GeneTest(APITestCase):

    gene1 = None
    gene2 = None
    good_url = ''
    bad_url = ''
    delete_url = ''

    def setUp(self):
        self.gene1 = GeneFactory.create(pk=1, gene_id='gene1')
        self.gene2 = GeneFactory.create(pk=2, gene_id='gene2')
        self.gene3 = GeneFactory.create(pk=3, gene_id='gene3')
        self.good_url = reverse('gene_api', kwargs={'pk': 1})
        self.bad_url = '/api/gene/H'
        self.delete_url = reverse('gene_api', kwargs={'pk': 3})

    def tearDown(self):
        EC.objects.all().delete()
        Sequencing.objects.all().delete()
        Gene.objects.all().delete()
        ECFactory.reset_sequence(0)
        SequencingFactory.reset_sequence(0)
        GeneFactory.reset_sequence(0)

    def test_geneDetailReturnSuccess(self):
        response = self.client.get(self.good_url, format='json')
        response.render()
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertTrue('entity' in data)
        self.assertEqual(data['entity'], 'Plasmid')

    def test_geneDetailReturnFailOnBadPk(self):
        response = self.client.get(self.bad_url, format='json')
        self.assertEqual(response.status_code, 404)

    def test_geneDetailDeleteIsSuccessful(self):
        response = self.client.delete(self.delete_url, format='json')
        self.assertEqual(response.status_code, 204)
