Feature: Real-time collaboration

  Scenario: User A type message and User B check message is synchronized
    Given "User A" has opened a document and start editing
    When "User A" types "Real-time collaboration editing start by userA" in the first paragraph
    Then "User B" should see the "Real-time collaboration editing start by userA" made by "User A" in real-time