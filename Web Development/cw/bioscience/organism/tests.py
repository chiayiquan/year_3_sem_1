import json
from django.test import TestCase
from django.urls import reverse, reverse_lazy

from rest_framework.test import APIRequestFactory, APITestCase

from .model_factories import *
from .serializers import *


class ProteinTest(APITestCase):
    protein = None
    good_url = ''
    bad_url = ''

    def setUp(self):
        self.protein = ProteinFactory.create(
        ).domains.set([DomainFactory.create()])
        self.good_url = reverse('protein_detail_api', kwargs={
            'protein_id': 'W5N0U1'})
        self.bad_url = "/api/protein/123/"

    def tearDown(self):
        ProteinDomainLink.objects.all().delete()
        Domain.objects.all().delete()
        Protein.objects.all().delete()
        Taxonomy.objects.all().delete()
        Pfam.objects.all().delete()

    def test_proteinDetailReturnSuccess(self):
        response = self.client.get(self.good_url, format='json')
        response.render()
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertDictEqual(data, self.protein)

    def test_proteinDetailReturnFailure(self):
        response = self.client.get(self.bad_url, format='json')
        response.render()
        self.assertEqual(response.status_code, 404)


# class ProteinSerializerTest(APITestCase):
#     protein = None
#     proteinserializer = None

#     def setUp(self):
#         self.protein = ProteinFactory.create(protein_id="W5N4R6").domains.set([
#             DomainFactory.create()])
#         print(self.protein)
#         self.proteinserializer = ProteinSerializer(
#             instance=self.protein)

#     def tearDown(self):
#         ProteinDomainLink.objects.all().delete()
#         Domain.objects.all().delete()
#         Protein.objects.all().delete()
#         Taxonomy.objects.all().delete()
#         Pfam.objects.all().delete()

#     def test_proteinSerilaiserHasCorrectFields(self):
#         data = self.proteinserializer.data
#         print(data)
#         self.assertEqual(set(data.keys()), set(['protein_id', 'sequence',
#                                                 'taxonomy', 'length', 'domains']))

#     def test_proteinSerilaiserGeneIDIsHasCorrectData(self):
#         data = self.proteinserializer.data
#         self.assertEqual(data['protein_id'], "W5N4R6")
