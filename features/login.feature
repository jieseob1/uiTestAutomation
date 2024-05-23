@beforeAll
Feature: Login

  @login
  Scenario: Successful login
    Given I am on the login page
    When I enter valid credentials
    And I click the login button
    And make new Document
    Then I should be redirected to the dashboard