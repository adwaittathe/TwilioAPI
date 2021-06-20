# Twilio SMS API

An express.js application that allows sending of SMS messages to the user and to create a conversation with the user. The app is based on the Twilio API (https://www.twilio.com).

[Click here](https://www.youtube.com/watch?v=iuR0kd2L2BM) to watch the demonstration of the application.

![](Twilio-mockup.png)


The user is able to enroll in the app by texting START to his/her study text number.
The app provides the required validation to ensure the user is not re-enrolled if already enrolled in the app. Upon enrolling in the app for the first time, the user gets the message "Welcome to the study".

Step 1: 
---
After enrolling in the study the user gets the following message: "Please indicate your symptom (1)Headache, (2)Dizziness, (3)Nausea, (4)Fatigue, (5)Sadness, (0)None"

The user is only allowed to enter a number 0-5. If the user sends a message, not in this range it sends the user a message: "Please enter a number from 0 to 5"
If the user enters 0, then send them this message "Thank you and we will check with you later." and stops messaging for this user.

Step 2: After answering the symptom selection message the user will be asked to rank their symptom "On a scale from 0 (none) to 4 (severe), how would you rate your "XXXX" in the last 24 hours?", where "XXXX" is the symptom they selected in the first message.
The user is only allowed to enter a number 0-4. If the user sends a message, not in this range you it sends the user a message: "Please enter a number from 0 to 4"

Step 3: After answering the rating question the user gets a follow-up message based on the rating level they selected:
if 1 or 2: then it sends "You have a mild XXXX" where XXXX is the symptom.
if 3: then it sends "You have a moderate XXXX" where XXXX is the symptom.
if 4: then send "You have a severe XXXX" where XXXX is the symptom.
if 0: then it sends "You do not have an XXXX"

After answering the rating question Step 1 is repeated, the symptom question is sent to the user 3 times. The app drops the choices that were selected previously by the user. 
For example, if the user picked Headache as a symptom, then the message will be: "Please indicate your symptom (1)Dizziness, (2)Nausea, (3)Fatigue, (4)Sadness, (0)None"
After the third time, the following message is sent to the user: "Thank you and see you soon"
