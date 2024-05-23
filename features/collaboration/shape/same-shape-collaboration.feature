@same-shape-editing
Feature: Same shape editing synchronization
  
  @same-shape-editing
  Scenario: Multiple users simultaneously editing the same shape
    Given "User A" and "User B" have opened the same document
    When "User A" inserts a new rectangle shape
    And "User A" resizes the shape
    And "User B" changes the position of the same shape
    Then The shape should be synchronized with the changes made by both users