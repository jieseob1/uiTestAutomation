@multiple-undo-redo
Feature: multiple undo redo test in collaboration
  
  @multiple-undo-redo
  Scenario: Multiple undo and redo actions
    Given "User A" and "User B" have opened the same document in multiple undo redo steps
    When "User A" types "Hello, World!" in multiple undo redo steps
    And "User A" types "This is a test." in multiple undo redo steps
    And "User A" undoes their changes twice in multiple undo redo steps
    Then "User B" should see the text "" in multiple undo redo steps
    When "User A" redoes their changes twice in multiple undo redo steps
    Then "User B" should see the text "Hello, World! This is a test." in multiple undo redo steps