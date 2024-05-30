@conflict-real-time-same-position
Feature: conflict in real time at same position in collaborative mode

  @conflict-real-time-same-position
  Scenario: Two users editing the same word or sentence simultaneously
    Given "User A" and "User B" have opened the same document in conflict real time same position
    When "User A" writes "Hello world." in conflict real time same position
    And both users simultaneously select "world" and changes it to "everyone" and "team" in conflict real time same position
    Then The document should display "Hello everyone team." at "User A" and "User B" in conflict real time same position
    