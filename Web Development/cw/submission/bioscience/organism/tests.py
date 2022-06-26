from email.policy import default
import json
from django.test import TestCase
from django.urls import reverse, reverse_lazy


from rest_framework.test import APIRequestFactory, APITestCase

from .model_factories import *
from .serializers import *


def newProteinFactory(data=default_data):
    ProteinFactory.create(protein_id=data['protein_id'], sequence=data['sequence'], taxonomy=TaxonomyFactory.create(taxa_id=data['taxonomy']['taxa_id'],
                                                                                                                    clade=data[
                                                                                                                        'taxonomy']['clade'],
                                                                                                                    genus=data[
                                                                                                                        'taxonomy']['genus'],
                                                                                                                    species=data['taxonomy']['species']),
                          length=data['length']).domains.set([DomainFactory.create(description=domain['description'],
                                                                                   start=domain['start'],
                                                                                   stop=domain['stop'],
                                                                                   pfam_id=PfamFactory.create(domain_id=domain['pfam_id']['domain_id'],
                                                                                                              domain_description=domain['pfam_id']['domain_description']))
                                                              for domain in data['domains']])


def setUp():
    newProteinFactory()
    newProteinFactory(mock_data_1)
    newProteinFactory(mock_data_2)


def tearDown():
    ProteinDomainLink.objects.all().delete()
    Domain.objects.all().delete()
    Protein.objects.all().delete()
    Taxonomy.objects.all().delete()
    Pfam.objects.all().delete()

########################## Api Test Case ##########################


class CreateProteinTest(APITestCase):
    url = reverse('create_protein_api')

    def tearDown(self):
        tearDown()

    def test_create_protein_success(self):
        response = self.client.post(self.url, default_data, format="json")
        response.render()
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.content)
        self.assertDictEqual(data, default_data)
        self.assertEqual(Protein.objects.count(), 1)
        protein = Protein.objects.filter(
            protein_id=default_data['protein_id'])[0]
        self.assertEqual(protein.protein_id, default_data['protein_id'])

    def test_create_protein_without_sequence_success(self):
        data_with_empty_sequence = {**default_data}
        data_with_empty_sequence['sequence'] = ""
        response = self.client.post(
            self.url, data_with_empty_sequence, format="json")
        response.render()
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.content)
        self.assertDictEqual(data, data_with_empty_sequence)
        self.assertEqual(Protein.objects.count(), 1)
        protein = Protein.objects.filter(
            protein_id=default_data['protein_id'])[0]
        self.assertEqual(protein.protein_id, default_data['protein_id'])

    def test_create_protein_duplicate_protein_id_failure(self):
        self.client.post(self.url, default_data, format="json")
        response = self.client.post(self.url, default_data, format="json")
        response.render()
        self.assertEqual(response.status_code, 400)

    def test_create_protein_missing_protein_id_field_failure(self):
        data_without_protein_id = {**default_data}
        del data_without_protein_id['protein_id']
        response = self.client.post(
            self.url, data_without_protein_id, format="json")
        response.render()
        self.assertEqual(response.status_code, 400)

    def test_create_protein_missing_taxonomy_field_failure(self):
        data_without_taxonomy = {**default_data}
        del data_without_taxonomy['taxonomy']
        response = self.client.post(
            self.url, data_without_taxonomy, format="json")
        response.render()
        self.assertEqual(response.status_code, 400)

    def test_create_protein_missing_length_field_failure(self):
        data_without_length = {**default_data}
        del data_without_length['length']
        response = self.client.post(
            self.url, data_without_length, format="json")
        response.render()
        self.assertEqual(response.status_code, 400)

    def test_create_protein_missing_domains_field_failure(self):
        data_without_domains = {**default_data}
        del data_without_domains['domains']
        response = self.client.post(
            self.url, data_without_domains, format="json")
        response.render()
        self.assertEqual(response.status_code, 400)


class ProteinTest(APITestCase):
    good_url = ''
    bad_url = ''

    def setUp(self):
        setUp()
        self.good_url = reverse('protein_detail_api', kwargs={
            'protein_id': 'W5N0U1'})
        self.bad_url = "/api/protein/123/"

    def tearDown(self):
        tearDown()

    def test_protein_detail_return_success(self):
        response = self.client.get(self.good_url, format='json')
        response.render()
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertDictEqual(data, default_data)

    def test_protein_detail_return_failure(self):
        response = self.client.get(self.bad_url, format='json')
        response.render()
        self.assertEqual(response.status_code, 404)


class PFamTest(APITestCase):
    good_url = reverse('pfam_detail_api', kwargs={
        'pfam_id': 'PF00520'})
    bad_url = reverse('pfam_detail_api', kwargs={
        'pfam_id': 'A0A066X4Z8'})

    def setUp(self):
        setUp()

    def tearDown(self):
        tearDown()

    def test_pfam_detail_return_success(self):
        response = self.client.get(self.good_url, format='json')
        response.render()
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertDictEqual(data, default_data['domains'][0]['pfam_id'])

    def test_pfam_detail_return_failure(self):
        response = self.client.get(self.bad_url, format='json')
        response.render()
        self.assertEqual(response.status_code, 404)


class ProteinListTest(APITestCase):
    good_url = reverse('proteins_api', kwargs={
        'taxa_id': 7918})
    bad_url = reverse('proteins_api', kwargs={
        'taxa_id': 5000})

    def setUp(self):
        setUp()

    def tearDown(self):
        tearDown()

    def test_protein_list_return_success(self):
        response = self.client.get(self.good_url, format='json')
        response.render()
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertTrue(len(data) == 1)
        self.assertEqual(data[0]['protein_id'], default_data['protein_id'])

    def test_protein_list_empty_result_return_success(self):
        response = self.client.get(self.bad_url, format='json')
        response.render()
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertTrue(len(data) == 0)


class PfamListTest(APITestCase):
    good_url = reverse('pfams_api', kwargs={
        'taxa_id': 7918})
    bad_url = reverse('pfams_api', kwargs={
        'taxa_id': 5000})

    def setUp(self):
        setUp()

    def tearDown(self):
        tearDown()

    def test_pfam_list_return_success(self):
        response = self.client.get(self.good_url, format='json')
        response.render()
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertTrue(len(data) == 1)
        self.assertDictEqual(data[0]['pfam_id'],
                             default_data['domains'][0]['pfam_id'])

    def test_pfam_list_empty_result_return_success(self):
        response = self.client.get(self.bad_url, format='json')
        response.render()
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertTrue(len(data) == 0)


class CoverageTest(APITestCase):
    good_url = reverse('coverage_api', kwargs={
        'protein_id': 'W5N0U1'})
    bad_url = reverse('coverage_api', kwargs={
        'protein_id': 'invalid'})

    def setUp(self):
        setUp()

    def tearDown(self):
        tearDown()

    def test_coverage_return_success(self):
        response = self.client.get(self.good_url, format='json')
        response.render()
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        start = default_data['domains'][0]['start']
        stop = default_data['domains'][0]['stop']
        length = default_data['length']
        self.assertEqual(data['coverage'], (stop-start)/length)

    def test_coverage_return_failure(self):
        response = self.client.get(self.bad_url, format='json')
        response.render()
        self.assertEqual(response.status_code, 404)

########################## Serializer Test Case ##########################


class TaxonomySerializerTest(APITestCase):
    taxonomy = None
    taxonomy_serializer = None

    def setUp(self):
        self.taxonomy = TaxonomyFactory.create()
        self.taxonomy_serializer = TaxonomySerializer(
            instance=self.taxonomy)

    def tearDown(self):
        tearDown()

    def test_taxnomy_serializer_has_correct_field(self):
        data = self.taxonomy_serializer.data
        self.assertEqual(set(data.keys()), set(
            ['taxa_id', 'clade', 'genus', 'species']))

    def test_taxonomy_serializer_has_correct_data(self):
        data = self.taxonomy_serializer.data
        self.assertDictEqual(data, default_data['taxonomy'])


class PfamSerializerTest(APITestCase):
    pfam = None
    pfam_serializer = None

    def setUp(self):
        self.pfam = PfamFactory.create()
        self.pfam_serializer = PfamSerializer(
            instance=self.pfam)

    def tearDown(self):
        tearDown()

    def test_pfam_serializer_has_correct_field(self):
        data = self.pfam_serializer.data
        self.assertEqual(set(data.keys()), set(
            ['domain_id', 'domain_description']))

    def test_pfam_serializer_has_correct_data(self):
        data = self.pfam_serializer.data
        self.assertDictEqual(data, default_data['domains'][0]['pfam_id'])


class DomainSerializerTest(APITestCase):
    domain = None
    domain_serializer = None

    def setUp(self):
        self.domain = DomainFactory.create()
        self.domain_serializer = DomainSerializer(
            instance=self.domain)

    def tearDown(self):
        tearDown()

    def test_domain_serializer_has_correct_field(self):
        data = self.domain_serializer.data
        self.assertEqual(set(data.keys()), set(
            ['pfam_id', 'description', 'start', 'stop']
        ))

    def test_domain_serializer_has_correct_data(self):
        data = self.domain_serializer.data
        self.assertDictEqual(data, default_data['domains'][0])


class ProteinSerializerTest(APITestCase):
    protein = None
    protein_serializer = None

    def setUp(self):
        self.protein = ProteinFactory.create()
        self.protein.domains.set([DomainFactory.create()])
        self.protein_serializer = ProteinSerializer(
            instance=self.protein)

    def tearDown(self):
        tearDown()

    def test_protein_serializer_has_correct_field(self):
        data = self.protein_serializer.data
        self.assertEqual(set(data.keys()), set(['protein_id', 'sequence',
                                                'taxonomy', 'length', 'domains']))

    def test_protein_serializer_has_correct_data(self):
        data = self.protein_serializer.data
        self.assertDictEqual(data, default_data)


class ListProteinSerializerTest(APITestCase):
    protein = None
    list_protein_serializer = None

    def setUp(self):
        self.protein = ProteinFactory.create()
        self.protein.domains.set([DomainFactory.create()])
        self.list_protein_serializer = ListProteinSerializer(
            instance=self.protein)

    def tearDown(self):
        tearDown()

    def test_list_protein_serializer_has_correct_field(self):
        data = self.list_protein_serializer.data
        self.assertEqual(set(data.keys()), set(['id', 'protein_id']))

    def test_list_protein_serializer_has_correct_data(self):
        data = self.list_protein_serializer.data
        self.assertDictEqual(data, {'id': 1, 'protein_id': 'W5N0U1'})


class ListPfamsSerializerTest(APITestCase):
    domain = None
    list_pfam_serializer = None

    def setUp(self):
        self.domain = DomainFactory.create()
        self.list_pfam_serializer = ListPfamsSerializer(
            instance=self.domain)

    def tearDown(self):
        tearDown()

    def test_list_pfams_serializer_has_correct_field(self):
        data = self.list_pfam_serializer.data
        self.assertEqual(set(data.keys()), set(['id', 'pfam_id']))

    def test_list_pfams_serializer_has_correct_data(self):
        data = self.list_pfam_serializer.data
        self.assertDictEqual(data, {'id': 1, 'pfam_id': {
            'domain_id': 'PF00520',
            'domain_description': 'Iontransportprotein'
        }})
