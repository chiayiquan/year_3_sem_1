# swagger_client.ApiApi

All URIs are relative to */*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create_gene**](ApiApi.md#create_gene) | **POST** /api/gene/{id}/ | 
[**destroy_gene**](ApiApi.md#destroy_gene) | **DELETE** /api/gene/{id}/ | 
[**list_genes**](ApiApi.md#list_genes) | **GET** /api/genes | 
[**retrieve_gene**](ApiApi.md#retrieve_gene) | **GET** /api/gene/{id}/ | 
[**update_gene**](ApiApi.md#update_gene) | **PUT** /api/gene/{id}/ | 

# **create_gene**
> Gene create_gene(id, body=body)



### Example
```python
from __future__ import print_function
import time
import swagger_client
from swagger_client.rest import ApiException
from pprint import pprint

# create an instance of the API class
api_instance = swagger_client.ApiApi()
id = 'id_example' # str | A unique integer value identifying this gene.
body = swagger_client.Gene() # Gene |  (optional)

try:
    api_response = api_instance.create_gene(id, body=body)
    pprint(api_response)
except ApiException as e:
    print("Exception when calling ApiApi->create_gene: %s\n" % e)
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**| A unique integer value identifying this gene. | 
 **body** | [**Gene**](Gene.md)|  | [optional] 

### Return type

[**Gene**](Gene.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **destroy_gene**
> destroy_gene(id)



### Example
```python
from __future__ import print_function
import time
import swagger_client
from swagger_client.rest import ApiException
from pprint import pprint

# create an instance of the API class
api_instance = swagger_client.ApiApi()
id = 'id_example' # str | A unique integer value identifying this gene.

try:
    api_instance.destroy_gene(id)
except ApiException as e:
    print("Exception when calling ApiApi->destroy_gene: %s\n" % e)
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**| A unique integer value identifying this gene. | 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **list_genes**
> list[GeneList] list_genes()



### Example
```python
from __future__ import print_function
import time
import swagger_client
from swagger_client.rest import ApiException
from pprint import pprint

# create an instance of the API class
api_instance = swagger_client.ApiApi()

try:
    api_response = api_instance.list_genes()
    pprint(api_response)
except ApiException as e:
    print("Exception when calling ApiApi->list_genes: %s\n" % e)
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**list[GeneList]**](GeneList.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **retrieve_gene**
> Gene retrieve_gene(id)



### Example
```python
from __future__ import print_function
import time
import swagger_client
from swagger_client.rest import ApiException
from pprint import pprint

# create an instance of the API class
api_instance = swagger_client.ApiApi()
id = 'id_example' # str | A unique integer value identifying this gene.

try:
    api_response = api_instance.retrieve_gene(id)
    pprint(api_response)
except ApiException as e:
    print("Exception when calling ApiApi->retrieve_gene: %s\n" % e)
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**| A unique integer value identifying this gene. | 

### Return type

[**Gene**](Gene.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **update_gene**
> Gene update_gene(id, body=body)



### Example
```python
from __future__ import print_function
import time
import swagger_client
from swagger_client.rest import ApiException
from pprint import pprint

# create an instance of the API class
api_instance = swagger_client.ApiApi()
id = 'id_example' # str | A unique integer value identifying this gene.
body = swagger_client.Gene() # Gene |  (optional)

try:
    api_response = api_instance.update_gene(id, body=body)
    pprint(api_response)
except ApiException as e:
    print("Exception when calling ApiApi->update_gene: %s\n" % e)
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**| A unique integer value identifying this gene. | 
 **body** | [**Gene**](Gene.md)|  | [optional] 

### Return type

[**Gene**](Gene.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

