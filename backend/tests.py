import unittest
import requests
import json

LOCALHOST_ANNOTATIONS = 'http://localhost:5000/annotations'


class B2noteRestApiTestCase(unittest.TestCase):

    evethread = None  # type: None
    #check whether EVE server is accepting request by HEAD method, if not, start as separate thread
    @classmethod
    def setUpClass(self):
      self.headers = {
        'Content-Type': 'application/json',
      }
      # test whether eve server is up and running
      print('Setup ')
      try:
        response = self.head(self,'')
        print(response.status_code)
      except Exception as e:
        #print(e)
        print('Starting EVE server in separate thread ...')
        # code 200 is not returned, then start the eve server
        import starteve
        import multiprocessing
        import time
        self.evethread = multiprocessing.Process(target=starteve.starteve)
        self.evethread.start()
        time.sleep(2)
        print('Started EVE server ...')


    #if server was started as separate thread, then terminate it after all tests
    @classmethod
    def tearDownClass(self):
      self.headers = {}
      # if the eve was started - then it will be stopped when the test process will terminate
      if self.evethread:
        self.evethread.terminate()
        print('Stopped EVE server ...')


    def head(self,resource):
      return requests.head(LOCALHOST_ANNOTATIONS+'/'+resource,headers=self.headers)

    def get(self,resource):
      return requests.get(LOCALHOST_ANNOTATIONS + '/' + resource, headers=self.headers)

    def post(self,data):
      return requests.post(LOCALHOST_ANNOTATIONS, headers=self.headers, data=data)


    def test_create_annotation(self):
      data = '{"id":"http://example.org/anno1","body":"http://example.com/post1","target":"http://example.com/page1"}'
      response = self.post(data)
      #print(response.content)
      assert b'"_status": "OK"' in response.content

    def test_create_annotation_bodyValue(self):
      data = '{"id":"http://example.org/anno1","bodyValue":"Comment here","target":"http://example.com/page1"}'
      response = self.post(data)
      #print(response.content)
      assert b'"_status": "OK"' in response.content


    def test_missing_target(self):
      data = '{"id":"1","body":"tests11.5"}'
      response = self.post(data)
      #print(response.content)
      assert b'Insertion failure' in response.content

    def test_bad_body_as_integer(self):
      data = '{"id":"1","body":3}'
      response = self.post(data)
      #print(response.content)
      assert b'Insertion failure' in response.content

    def test_create_annotation_get_annotation_detail(self):
      data = '{"id":"http://example.org/anno1","body":"http://example.com/post1","target":"http://example.com/page1"}'
      response = self.post(data)
      #print(response.content)
      responsedata = json.loads(response.content)
      #print(responsedata)
      assert b'"_status": "OK"' in response.content
      #print(response.content)
      self.assertIsInstance(responsedata['_id'], str)
      response2 = self.get(responsedata['_id'])
      responsedata2 = json.loads(response2.content)
      #print(responsedata2)
      self.assertEquals(responsedata['_id'],responsedata2['_id'])

    def test_stringbody_schema(self):
      body = '{"id":"http://example.org/anno1","body":"http://example.com/post1","target":"http://example.com/page1"}'
      response = self.post(body)
      #print(response.content)
      assert b'"_status": "OK"' in response.content

    def test_listbody_schema(self):

      body = '{"id":"http://example.org/anno1","body":["http://example.com/post1","http://example.com/post2"],"target":"http://example.com/page1"}'
      response = self.post(body)
      #print(response.content)
      assert b'"_status": "OK"' in response.content

    def test_listbodyids_schema(self):
      body = '{"id":"http://example.org/anno1","body":[{"id":"http://example.com/post1"},{"id":"http://example.com/post2"}],"target":"http://example.com/page1"}'
      response = self.post(body)
      print(response.content)
      assert b'"_status": "OK"' in response.content

    def test_listbodyformats_schema(self):
      body = '{"id":"http://example.org/anno1","body":[{"id":"http://example.com/post1","format":"audio/mpeg"},{"id":"http://example.com/post2","format":"application/pdf"}],"target":"http://example.com/page1"}'
      response = self.post(body)
      assert b'"_status": "OK"' in response.content




if __name__ == '__main__':
    unittest.main()



