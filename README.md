# Robotict meteor test app

The application consist of a single page (multiple pages are optional if
your design requires them) containing a list (table, plain text, etc.) of words:
- "Robot" if the number is divisible by 3,
- "ICT" if the number is divisible by 5,
- "RobotICT" if the number is divisible by 3 and 5.
In all other cases, the application should print just the number.
dd other elements like buttons, links, styles, etc., if your design requires - it's optional but
welcomed. The result should be displayed on a page of a running MeteorJS application.


## Note
set to true to replace values from local JSON files
Meteor.startup(() => {
    loadThemesFromJSON(true);
    loadSettingsFromJSON(false);
});