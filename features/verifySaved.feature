Feature: Document Message

  Scenario: Write and verify a message in a document
    Given I am on the document page
    When I enter the document
    And I write a message "Hello, World!"
    And I exit the document
    And I enter the document again
    Then I should see the message "Hello, World!"
