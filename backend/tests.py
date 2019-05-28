import os
import unittest
import requests



class FlaskrTestCase(unittest.TestCase):

    def setUp(self):
      self.headers = {
        'Content-Type': 'application/json',
      }

    def tearDown(self):
      self.headers = {}
      # some code here


    def post(self,data):
      return requests.post('http://localhost:5000/annotations', headers=self.headers, data=data)


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


if __name__ == '__main__':
    unittest.main()



