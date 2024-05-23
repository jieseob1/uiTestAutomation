@multiple-undo-redo
Feature: multiple undo redo test in collaboration
  
  @multiple-undo-redo
  Scenario: Multiple undo and redo actions
    Given "User A" and "User B" have opened the same document
    When "User A" types "Hello, World!"
    And "User A" types "This is a test."
    And "User B" sees the changes made by "User A"
    And "User A" undoes their changes twice
    Then "User B" should see the text ""
    When "User A" redoes their changes twice
    Then "User B" should see the text "Hello, World! This is a test."