import httplib, json
import getopt, sys, os
import subprocess
import fnmatch
from xml.etree import ElementTree

def get_connection(organization):
  return httplib.HTTPSConnection('%s.slack.com' % organization)

def get_url(token):
  return '/services/hooks/incoming-webhook?token=%s' % token

def get_data_from_git(format_string, commit):
  return subprocess.check_output(['git', 'log', '--since=LAST_SUCCESSFUL_BUILD_TIMESTAMP', '--format=format:%s' % format_string, commit])

def get_author(commit):
  return get_data_from_git('%an <%ae>', commit)

def get_date(commit):
  return get_data_from_git('%aD', commit)

def get_title(commit):
  return get_data_from_git('%s', commit)

def get_full_message(commit):
  return get_data_from_git('%b', commit)

def get_commits(commit):
  since = os.environ['LAST_SUCCESSFUL_BUILD_TIMESTAMP']
  return subprocess.check_output(['git', 'log', '--since=%s' % since, '--format=%an: <%h> %s'])

def get_unit_tests():
    # return "Tests skipped";
    tests = 0
    errors = 0
    failures = 0

    root = ElementTree.parse('shippable/testresults/korner_client.xml').getroot()
    for data in root.findall('testsuite'):

        tests    += int(data.attrib.get("tests"))
        errors   += int(data.attrib.get("errors"))
        failures += int(data.attrib.get("failures"))



    return "%d tests with %d failures (%d errors)" % (tests, failures, errors)

def post_message(connection, url, success, project, emoji):
  headers = {'Content-Type': 'application/json'}
  build_url = os.environ['BUILD_URL']
  build_number = os.environ['BUILD_NUMBER']
  branch = os.environ['BRANCH']
  commit = os.environ['COMMIT']

  tests = get_unit_tests()

  # this checks to see if we had 0 failures and alters the success flag if we had failures
  if tests.find("with 0 failures (0 errors)") == -1:
    success = False
    emoji =":bangbang:"

  status_text = 'succeeded' if success else 'failed'
  color = 'good' if success else 'danger'
  text = '<%s|Build #%s> *%s* for project %s on branch %s' % (build_url, build_number, status_text, project, branch)

  message = {
    'username': 'Mobile Client - build',
    'fallback': text,
    'pretext': text,
    'color': color,
    'fields': [
      {
        'title': 'commits',
        'value': get_commits(commit)
      },
        {
         'title': 'unit tests',
         'value': tests
        }
    ],
    'icon_emoji': emoji
  }

  connection.request('POST', url, json.dumps(message), headers)
  response = connection.getresponse()
  print response.read().decode()

def main():
  try:
    opts, args = getopt.getopt(sys.argv[1:], ':sf', ['project=', 'org=', 'token=', "emoji="])
  except getopt.GetoptError as err:
    print str(err)
    sys.exit(2)

  success = False
  project = None
  organization = None
  token = None
  emoji = None
  for o, arg in opts:
    if o == '-s':
      success = True
    elif o == '--project':
      project = arg
    elif o == '--org':
      organization = arg
    elif o == '--token':
      token = arg
    elif o == '--emoji':
      emoji = arg

  connection = get_connection(organization)
  url = get_url(token)
  post_message(connection, url, success, project, emoji)

if __name__ == '__main__':
  main()
