import factory

from django.test import TestCase
from django.conf import settings
from django.core.files import File

from .models import *

default_data = {
    'protein_id': 'W5N0U1',
    'sequence': 'MATAESNAVGPAASIIMDSETLRRKQKEKLKKLQATGGNPRPPRSLCCLTLKNPFRKACISIVEWKPFEIIILLTIFANCVALAVFLPMPEDDTNSANSSLEKVEYIFLIVFTIEAFLKIVAYGFLFHPDAYLRNGWNILDFVIVFVGLFTVALETINRIEGIETPVGGKGAGFDVKALRAFRVLRPLRLVSGVPSLQVVLNSIIKAMVPLLHIALLVLFMIIIYAIIGLELFKCKMHKTCYYTGTRIVAMVENEKPAPCATGGHGRECSLNGTECKSGWAGPNNGITHFDNFGFAMLTVYQCITMEGWTDVLYWVNDAIGNEWPWIYFVSLILLGSFFVLNLVLGVLSGEFTKEREKAKSRGEFQKLRERQQLEEDLKGYLDWITHAEVMDNDQEHREGLLPLDEGGSDTESLFEMEGMNRFILFFRRWRRWNRWFRRKCRTWVKSNFFYWLVILLVFLNTLAIATEHHNQADWLTKVQDTANKVLLSLFTAEMLLKMYALGFQSYFMSLFNRFDCFVVCAGIIELILVELGVMSPLGISVLRCIRLLRIFKITKYWTSLSNLVASLLNSVRSIASLLLLLFLFIIIFSLLGMQVFGGKYNFPDMEVRRSTFDNFPQALISVFQILTGEDWNSVMYNGIMAYGGPSLPGVLVCIYFIILFVCGNYILLNVFLAIAVDNLAEAESLTSAQKEKAEEKKRKKLARSNKPEKSEEEKLLLAKKLEQKAKGESIPTTAKLKVDEFESNVNEIKDPYPSADFPGDDEEEEPEIPLSPRPRPLAELQLKEKAVPMPEASAFFIFGPQNKIRKLCHRIVNATTFTNFILLFILLSSISLAAEDPIDPESFRNKILGYFDIVFTVVFTAEIVLKMTTYGAFLHKGSFCRNYFNILDLLVVGVSLISFVIQSSAISVVKILRVLRVLRPLRAINRAKGLKHVVQCVFVAIKTIGNIVIVTMLLDFMFACIGVQLFKGKFHMCTDPSKMTEEECRGEFFLFKENDLHGLEVHKRIWVNSDFNFDNVLSGMMALFTVSTFEGWPQLLYKAIDSHTEDMGPIYNNRVEISIFFIVYIILIAFFMMNIFVGFVIVTFQEQGEQEYKNCELDKNQRQCVQYALKARPLRRYIPKNPYQYQIWYVVTSSYFEYLMFMLILLNTICLGMQHCGQSEDLNSISDMLNVVFTGLFTLEMVLKLMAFKAKGYFGDPWNVFDFLIVIGSIIDVILSEIDTALSSSGGLYCLSGGCAGDSNDIPAADTEEHARISITFFRLFRVMRLVKLLSRGEGVRTLLWTFIKSFQALPYVALLIVMLFFIYAVIGMQVFGKIALVDGTQINRNNNFQMFPQAVLLLFRCATGEAWQEIMLACMYGKLCDPNSDFLPGEEYTCGSSFAVFYFISFYMLCAFLIINLFVAVIMDNFDYLTRDWSILGPHHLDEFKRIWAEYDPEAKGRIKHLDVVTLLRRIQPPLGFGKFCPHRVACKRLVSMNMPLNSDGTVTFNATLFALVRTALKIKTEGNFEQSNEELRAIIKKIWKRTSMKLLDQVIPPIGDDEVTVGKFYATFLIQDHFRKFMKRQEEYYGYRPTRKNAVEIQAGLRSIEEEVAPELKRAISGDLTAEEEMDRAMEDAAMEEGIYRRSGGLFGNHVDHFPLERSSPLPTNVTSHRPLQLADNRPEDIESPPDSVFLPNTEFFPQGNTNNANSNTNNNAAERFAVENEMTKELPLTAETDKSKTDTRKKRQAQPAREPRLKRSCADQQDDKDNLFSQIPKESITEQIPHHPSESRSELMSVGTCSRSSEHATGDRGRPVSATDQLIQEVLIEGGLEVLARDPKFVAVTKREMAEAIHIDLEEMEGAAMVILNGRRGRVVKHRASTTPALKHHREPQDTTLADSCL',
    'taxonomy': {
        'taxa_id': 7918,
        'clade': 'E',
        'genus': 'Lepisosteus',
        'species': 'oculatus'
    },
    'length': 1882,
    'domains': [
        {
            'pfam_id': {
                'domain_id': 'PF00520',
                'domain_description': 'Iontransportprotein'
            },
            'description': 'Ion transport domain',
            'start': 448,
            'stop': 686
        }
    ]
}

mock_data_1 = {
    "protein_id": "A0A016S8J7",
    "sequence": "MVIGVGFLLVLFSSSVLGILNAGVQLRIEELFDTPGHTNNWAVLVCTSRFWFNYRHVSNVLALYHTVKRLGIPDSNIILMLAEDVPCNPRNPRPEAAVLSA",
    "taxonomy": {
        "taxa_id": 53326,
        "clade": "E",
        "genus": "Ancylostoma",
        "species": "ceylanicum"
    },
    "length": 101,
    "domains": [
        {
            "pfam_id": {
                "domain_id": "PF01650",
                "domain_description": "PeptidaseC13family"
            },
            "description": "Peptidase C13 legumain",
            "start": 40,
            "stop": 94
        },
        {
            "pfam_id": {
                "domain_id": "PF02931",
                "domain_description": "Neurotransmitter-gatedion-channelligandbindingdomain"
            },
            "description": "Neurotransmitter-gated ion-channel ligand-binding domain",
            "start": 23,
            "stop": 39
        }
    ]
}

mock_data_2 = {
    "protein_id": "A0A061S8M4",
    "sequence": "VYNKYKNLKTCGVIEEDRVLGYTKYAEPIGPIAGIIPVTNPTSTVIFKALIALKTRNCILFSPHPAAARVCAYTAELLRRAAVKAGAPENCIQCVSSDRETAFSVLTHKSIHFTLATGGPGIVGAVYRSGKPAIGVGPGNAPAIIDELADLPTAVSSVVLSKTFDNGMICASENALVVVDEVYDKVLHLLKRRGCMILNDEETKKLGAALIQDGHLNADMVGQPPEKIGEIAGIDVPQGTVALVGQATEIGYHEPMSFEKLSPIIGMYRAKDFDDALDIADQMASFGGEGHTAILYTDAKRRDRIAQFEERMPTYKILIDQPSAFGAIGDVYNFSLAPSLTLGCGAKGGSSVSTNVGPEHLIHVKTVTERRENMLWFKVPKSIYFKRGIFAEAMRDLKGAKRALVITDRTMVKLGMVDPLLDILKANGMAVRVFDEVTPDPTITCIHRGRDAMIDFEPDTVIAFGGGSPMDAAKVMRLMYEQPEMTMEALTARFLDIRKRVMDFPALGTKVKNLICVPTTSGTGAEVTPFAVVTGSDDRKYPICDYSLTPEMAIIDPNFTQGMPQSLTAATGYDALVHAVESFVSTFATDYTKAQSLHATRLINENLVPAYRDGSSEVHRENMHNASAIAGMAFANAFLGICHSMAHQLGAQFHIPHGTANALMLNHVIAFNATDAPTKMAAFSQYKYPMAIKGYAEMADALNLAKPGDTDEDKVWALINRFEELKQELDLPMSIKDAGVSWDDFESKLDMMAAMAFDDQCTGANPRYPLIKELKQLFIDAYHGKPKELGMTLQRAPKVVMSASSHRASETRIGSVAQFRRPLFARPSPRPLLSRPSVVRVSGTAPRILRVANYVAAKPLLSFRM",
    "taxonomy": {
        "taxa_id": 582737,
        "clade": "E",
        "genus": "Tetraselmis",
        "species": "sp."
    },
    "length": 865,
    "domains": [
        {
            "pfam_id": {
                "domain_id": "PF00465",
                "domain_description": "Iron-containingalcoholdehydrogenase"
            },
            "description": "Alcohol dehydrogenase iron-type",
            "start": 380,
            "stop": 771
        }
    ]
}


class TaxonomyFactory(factory.django.DjangoModelFactory):
    taxa_id = default_data['taxonomy']['taxa_id']
    clade = default_data['taxonomy']['clade']
    genus = default_data['taxonomy']['genus']
    species = default_data['taxonomy']['species']

    class Meta:
        model = Taxonomy


class PfamFactory(factory.django.DjangoModelFactory):
    domain_id = default_data['domains'][0]['pfam_id']['domain_id']
    domain_description = default_data['domains'][0]['pfam_id']['domain_description']

    class Meta:
        model = Pfam


class DomainFactory(factory.django.DjangoModelFactory):
    pfam_id = factory.SubFactory(PfamFactory)
    description = default_data['domains'][0]['description']
    start = default_data['domains'][0]['start']
    stop = default_data['domains'][0]['stop']

    class Meta:
        model = Domain


class ProteinFactory(factory.django.DjangoModelFactory):
    protein_id = default_data['protein_id']
    sequence = default_data['sequence']
    taxonomy = factory.SubFactory(TaxonomyFactory)
    length = default_data['length']

    class Meta:
        model = Protein
