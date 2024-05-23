@other-shape-editing
Feature: Other shape editing synchronization
  
  @other-shape-editing
  Scenario: Shape insertion and individual modifications synchronized in real-time
    Given "User A" and "User B" have opened the same document
    When "User A" inserts a new shape
    And "User A" resizes the shape
    And "User B" inserts another shape
    And "User B" changes the position of their shape
    Then Both shapes should be synchronized in real-time for both users
