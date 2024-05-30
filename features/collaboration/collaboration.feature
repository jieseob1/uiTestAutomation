@collaboration
Feature: Document Collaboration
  
  @collaboration
  Scenario: Two users simultaneously editing different parts of the document
    Given "User A" and "User B" have opened the same document in collaborationsteps
    When "User A" types "Collaborative document editing facilitates seamless communication among team members." in the first paragraph in collaborationsteps
    And "User B" types "Real-time synchronization of changes enables efficient workflow." in the second paragraph in collaborationsteps
    Then The changes made by both users should be reflected on the screens of "User A" and "User B" in collaborationsteps