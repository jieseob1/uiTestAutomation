@conflict-real-time-same-position
Feature: Conflict resolution and merging during collaborative editing

  @conflict-real-time-same-position
  Scenario: Two users editing the same word or sentence simultaneously
    Given "User A" and "User B" have opened the same document
    When "User A" selects a word and changes it to "hello"
    And "User B" selects the same word and changes it to "world"
    Then The changes made by both users should be merged correctly
    And The document should display "hello world"
    And The changes should be synchronized for both "User A" and "User 
