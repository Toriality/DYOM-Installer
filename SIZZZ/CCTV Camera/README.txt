This script adds working CCTV cameras to the game for DYOM missions.
They can be arranged as regular objects (ID 1886) using DYOM#.
The cameras operate within a radius of 25 units. When a player is detected in the field of view, a red indicator lights up on the camera and a beep sounds. The player will have some time to hide. If the player remains in the camera's field of view, the mission will fail.
- Added camera control panels, thanks to which the player can look through the cameras and turn them off. To place the control panel, add the object ID 2606 to the map. The control panel acts on cameras within a radius of 700 units.

In the Security Camera.ini settings file, you can configure some camera functions:
TIME — the time that will be given to the player to hide after detection
SOUND - the sound of the camera when the player is detected
ALARM — can the cameras detect the player
OFF - the ability to disable cameras using the control panel
REDLIGHT — red indicator on the camera when the player is detected

Important:
1) The cameras should be at an angle of 90 degrees in the standard position. If they are tilted, they will detect the player's location incorrectly or will not detect it at all.
2) It is not recommended to put cameras close to each other, since if a player is detected by one camera, the second one will not work while the red indicator is on the first one.