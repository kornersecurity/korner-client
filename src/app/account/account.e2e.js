// account.spec.js
/*
"use strict";

describe('Login page', function() {

  var loginText = element(by.model('login.email'));
  var passwordText = element(by.model('login.password'));
  var loginButton = element(by.id('loginButton'));

  beforeEach(function() {
    browser.get('#/account/login');
    loginText.clear();
    passwordText.clear();
  });


  it('should show error for missing email', function() {
    passwordText.sendKeys('Password');

    loginButton.click();
    browser.waitForAngular();

    element.all(by.repeater('alert in alerts')).then(function(alerts) {
      var alert = alerts[0].element(by.id('alertDiv'));
      expect(alert.getText()).toContain('Invalid User');
    });
  });


  it('should show error for incorrect password', function() {
    loginText.sendKeys('matt.smith@kornersafe.com');
    passwordText.sendKeys('drowssaP');

    loginButton.click();
    browser.waitForAngular();

    element.all(by.repeater('alert in alerts')).then(function(alerts) {
      var alert = alerts[0].element(by.id('alertDiv'));
      expect(alert.getText()).toContain('Invalid Password');
    });
  });


  it('should show error for unknown user', function() {
    loginText.sendKeys('sam.matt@kornersafe.com');
    passwordText.sendKeys('Password');

    loginButton.click();
    browser.waitForAngular();

    element.all(by.repeater('alert in alerts')).then(function(alerts) {
      var alert = alerts[0].element(by.id('alertDiv'));
      expect(alert.getText()).toContain('Invalid User');
    });
  });


  it('should login successfully', function() {
    loginText.sendKeys('matt.smith@kornersafe.com');
    passwordText.sendKeys('Password');

    // TODO: have to click twice?
    loginButton.click();
    loginButton.click();
    browser.waitForAngular();

    expect(browser.getCurrentUrl()).toContain('#/home/select');
  });


});


describe('Forgot Password page', function() {

  var emailText;
  var backButton;
  var resetButton;

  beforeEach(function() {
    browser.get('#/account/login');
    browser.waitForAngular();

    element(by.id('forgotPasswordButton')).click().then(function() {
      emailText = element(by.model('reset.email'));
      backButton = element(by.id('backButton'));
      resetButton = element(by.id('resetButton'));

      emailText.clear();

    });
  });


  it('should disable Reset if no email', function() {
    expect(resetButton.getAttribute('class')).toContain('disabled');
  });


  it('should enable Reset if email is specified', function() {
    emailText.sendKeys('matt.smith@kornersafe.com');
    expect(resetButton.getAttribute('class')).not.toContain('disabled');
  });


  it('should display Password Reset popup if Reset is pressed', function() {
    emailText.sendKeys('matt.smith@kornersafe.com');
    resetButton.click();

    expect(0).toBe(0);
  });


  it('should return to Login page if Back is pressed', function() {
    backButton.click();
    browser.waitForAngular();
    expect(browser.getCurrentUrl()).toContain('#/account/login');
  });


});


describe('Register User page', function() {

  var firstNameText;
  var lastNameText;
  var emailText;
  var cancelButton;
  var registerButton;

  beforeEach(function() {
    browser.get('#/account/login');
    browser.waitForAngular();

    element(by.id('registerButton')).click().then(function() {
      firstNameText = element(by.model('registration.first_name'));
      lastNameText = element(by.model('registration.last_name'));
      emailText = element(by.model('registration.email'));
      cancelButton = element(by.id('cancelButton'));
      registerButton = element(by.id('registerButton'));

      firstNameText.clear();
      lastNameText.clear();
      emailText.clear();
    });
  });


  it('should return to login if Cancel is pressed', function() {
    cancelButton.click();
    browser.waitForAngular();
    expect(browser.getCurrentUrl()).toContain('#/account/login');
  });


});

*/
