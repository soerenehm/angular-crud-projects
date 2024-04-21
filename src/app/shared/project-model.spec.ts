// Http testing module and mocking controller
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// Other imports
import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import {Projects} from '@angular/cli/lib/config/workspace-schema';
import {Project} from './project.model';

const expectedProjects: Projects[] = [{
  id: 1,
  task: 'Fullstack UI und API Entwicklung von Services für die Online Anzeige von Artikeln.',
  operations: 'Fachliche Erweiterungen in Spring Microservices, Testerstellung für Front- und Backend, Planning und Estimation im Scrum Prozess',
  customer: 'Online-Versandhandel',
  duration: '3 Monate, 03/2020 - 05/2020',
  technics: 'Spring Framework, Java 11, AWS Services, Python, JavaScript, Preact, JUnit, Jasmine, TestCafe, Togglz, FreeMarker'
}];

const testUrl = 'http://localhost/projects';
describe('ProjectService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });

    // Inject the http service and test controller for each test
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  /// Tests begin ///
  it('can test HttpClient.get', () => {
    // Make an HTTP GET request
    httpClient.get<Project[]>(testUrl)
      .subscribe(data =>
        // When observable resolves, result should match test data
        expect(data).toEqual(expectedProjects)
      );

    // The following `expectOne()` will match the request's URL.
    // If no requests or multiple requests matched that URL
    // `expectOne()` would throw.
    const req = httpTestingController.expectOne(testUrl);

    // Assert that the request is a GET.
    expect(req.request.method).toEqual('GET');

    // Respond with mock data, causing Observable to resolve.
    // Subscribe callback asserts that correct data was returned.
    req.flush(expectedProjects);

    // Finally, assert that there are no outstanding requests.
    httpTestingController.verify();
  });

  it('can test for network error', done => {
    // Create mock ProgressEvent with type `error`, raised when something goes wrong
    // at network level. e.g. Connection timeout, DNS error, offline, etc.
    const mockError = new ProgressEvent('error');

    httpClient.get<Project[]>(testUrl).subscribe({
      next: () => fail('should have failed with the network error'),
      error: (error: HttpErrorResponse) => {
        expect(error.error).toBe(mockError);
        done();
      },
    });

    const req = httpTestingController.expectOne(testUrl);

    // Respond with mock error
    req.error(mockError);
  });

  it('httpTestingController.verify should fail if HTTP response not simulated', () => {
    // Sends request
    httpClient.get('some/api').subscribe();

    // verify() should fail because haven't handled the pending request.
    expect(() => httpTestingController.verify()).toThrow();

    // Now get and flush the request so that afterEach() doesn't fail
    const req = httpTestingController.expectOne('some/api');
    req.flush(null);
  });
});
