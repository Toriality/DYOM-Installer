!include "MUI2.nsh"

Name "DYOM 8.1 Installer"
OutFile "DYOM Setup.exe"
Unicode True

InstallDir "$DOCUMENTS\GTA San Andreas User Files"

RequestExecutionLevel admin

!define MUI_ABORTWARNING

;!insertmacro MUI_LICENSE_PAGE "$EXEDIR\License.txt"
!insertmacro MUI_PAGE_COMPONENTS

Var INSTDIR2

# First directory page.
!insertmacro MUI_PAGE_DIRECTORY

# Second directory page.
!define MUI_DIRECTORYPAGE_VARIABLE $INSTDIR2
!define MUI_PAGE_CUSTOMFUNCTION_PRE DirectoryPre
!insertmacro MUI_PAGE_DIRECTORY

Function DirectoryPre
 StrCpy $INSTDIR2 "$PROGRAMFILES\Rockstar James\Grand Theft Fausto"
FunctionEnd

!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_LANGUAGE "English"


SectionGroup "DYOM 8.1" DYOM
	Section "DYOM Required Files" DYOM_Files
		SectionIn 1
		SetOutPath "$INSTDIR"
		File /r ".\_DYOM_FILES\"
		SectionEnd

	Section "DYOM Dependencies" DYOM_Dependencies
		SectionIn 2
		SetOutPath "$INSTDIR2"
		File /r ".\_DYOM_DEPENDENCIES\"
		SectionEnd
SectionGroupEnd

SectionGroup "SIZZZ's Addons" SIZZZ
	Section "DYOM#" DYOM_Sharp
		SetOutPath "$INSTDIR2\modloader\"
		File /r ".\SIZZZ\DYOM#"
	SectionEnd
	
	Section "Machine Gun" MachineGun
		SetOutPath "$INSTDIR2\modloader\"
		File /r ".\SIZZZ\Machine Gun"
	SectionEnd

	Section "Darkness Effect" DarkEffect
		SetOutPath "$INSTDIR2\modloader\"
		File /r ".\SIZZZ\Darkness Effect"
	SectionEnd
	

	Section "Working Dynamites" WDynamites
		SetOutPath "$INSTDIR2\modloader\"
		File /r ".\SIZZZ\Working Dynamites"
	SectionEnd

	Section "Road Spikes" RoadSpikes
		SetOutPath "$INSTDIR2\modloader\"
		File /r ".\SIZZZ\Road Spikes"
	SectionEnd

	Section "Disable teleport health regeneration" TeleportHealth
		SetOutPath "$INSTDIR2\modloader\"
		File /r ".\SIZZZ\Disable Teleport Health Regeneration"
	SectionEnd

	Section "CCTV Cameras" CCTV
		SetOutPath "$INSTDIR2\modloader\"
		File /r ".\SIZZZ\CCTV Camera"
	SectionEnd

	Section "Phone talk animation" PhoneAnim
		SetOutPath "$INSTDIR2\modloader\"
		File /r ".\SIZZZ\Phone Animation"
	SectionEnd

	Section "Weapon Shops" WeaponShops
		SetOutPath "$INSTDIR2\modloader\"
		File /r ".\SIZZZ\Weapon Shops"
	SectionEnd
SectionGroupEnd

SectionGroup "Axoez's Addons" Axoez
	Section "Time selection in milliseconds" TimeMs
		SetOutPath "$INSTDIR2\modloader\"
		File /r ".\AXOEZ\Time Selection in Milliseconds"
	SectionEnd
	
	Section "Phonecall Skip" PhoneSkip
		SetOutPath "$INSTDIR2\modloader\"
		File /r ".\AXOEZ\Phonecall Skip"
	SectionEnd
SectionGroupEnd

;SectionGroup "Kumamon's Addons" Kumamon
;	Section "SA:MP Objects" SAMP
;		SetOutPath "$INSTDIR2\modloader\"
;		File /r ".\KUMAMON\SAMP Objects"
;	SectionEnd
;SectionGroupEnd
;


;Descriptions

  LangString DYOM_S ${LANG_ENGLISH} "Design Your Own Mission Files"
  LangString DYOM_Files_S ${LANG_ENGLISH} "All the files necessary for running Design Your Own Mission 8.1 modification. They are installed into your GTA San Andreas User Files directory."
  LangString DYOM_Dependencies_S ${LANG_ENGLISH} "All the dependencies needed to run DYOM without crashes and major issues. They are installed into your GTA San Andreas root directory."
  
  LangString SIZZZ_S ${LANG_ENGLISH} "Add-ons made by SIZZZ."
  LangString DYOM_Sharp_S ${LANG_ENGLISH} "An extensive script that adds many new features, new tools and fixes some bugs. With this add-on, designing mission will be more efficient and fast."
  LangString MachineGun_S ${LANG_ENGLISH} "Adds a working machine gun to your missions."
  LangString DarkEffect_S ${LANG_ENGLISH} "Creates a very dark ambience effect when a certain weather is selected."
  LangString WDynamites_S ${LANG_ENGLISH} "The dynamite object explodes when the player gets near it."
  LangString RoadSpikes_S ${LANG_ENGLISH} "With this script, road spikes turn from an ordinary decoration into real working spikes."
  LangString TeleportHealth_S ${LANG_ENGLISH} "This will stop the player's health from regenerating when you have a teleport objective. With works if you teleport the player using the same skin."
  LangString CCTV_S ${LANG_ENGLISH} "A working CCTV camera that fails the mission if the players gets detected for a certain ammount of time inside the camera radius. Recommended for stealth missions."
  LangString PhoneAnim_S ${LANG_ENGLISH} "Adds a phone talking animation."
  LangString WeaponShops_S ${LANG_ENGLISH} "Adds the hability to have up to 5 weapons stores into your mission, where you can buy almost every kind of weapon."

  LangString Axoez_S ${LANG_ENGLISH} "Add-ons made by Axoez / RaXo."
  LangString TimeMs_S ${LANG_ENGLISH} "Adds the hability to select the time in milliseconds."
  LangString PhoneSkip_S ${LANG_ENGLISH} "With this script, you can skip the phonecalls. Recommended for missions with long phonecall dialogues."

  LangString Kumamon_S ${LANG_ENGLISH} "Add-ons made by Kumamon"
  LangString SAMP_S ${LANG_ENGLISH} "Adds about 1500 new objects into the game. DYOM# is required to use these objects."

  
  !insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
	!insertmacro MUI_DESCRIPTION_TEXT ${DYOM} $(DYOM_S)
    !insertmacro MUI_DESCRIPTION_TEXT ${DYOM_Files} $(DYOM_Files_S)
	!insertmacro MUI_DESCRIPTION_TEXT ${DYOM_Dependencies} $(DYOM_Dependencies_S)
	!insertmacro MUI_DESCRIPTION_TEXT ${SIZZZ} $(SIZZZ_S)
	!insertmacro MUI_DESCRIPTION_TEXT ${DYOM_Sharp} $(DYOM_Sharp_S)
	!insertmacro MUI_DESCRIPTION_TEXT ${MachineGun} $(MachineGun_S)
	!insertmacro MUI_DESCRIPTION_TEXT ${DarkEffect} $(DarkEffect_S)
	!insertmacro MUI_DESCRIPTION_TEXT ${WDynamites} $(WDynamites_S)
	!insertmacro MUI_DESCRIPTION_TEXT ${RoadSpikes} $(RoadSpikes_S)
	!insertmacro MUI_DESCRIPTION_TEXT ${TeleportHealth} $(TeleportHealth_S)
	!insertmacro MUI_DESCRIPTION_TEXT ${CCTV} $(CCTV_S)
	!insertmacro MUI_DESCRIPTION_TEXT ${PhoneAnim} $(PhoneAnim_S)
	!insertmacro MUI_DESCRIPTION_TEXT ${WeaponShops} $(WeaponShops_S)
	!insertmacro MUI_DESCRIPTION_TEXT ${Axoez} $(Axoez_S)
	!insertmacro MUI_DESCRIPTION_TEXT ${TimeMs} $(TimeMs_S)
	!insertmacro MUI_DESCRIPTION_TEXT ${PhoneSkip} $(PhoneSkip_S)
	!insertmacro MUI_DESCRIPTION_TEXT ${Kumamon} $(Kumamon_S)
	!insertmacro MUI_DESCRIPTION_TEXT ${SAMP} $(SAMP_S)
  !insertmacro MUI_FUNCTION_DESCRIPTION_END
  

Function .onInit
  SectionSetFlags ${DYOM_Files} 17
  SectionSetFlags ${DYOM_Dependencies} 17
FunctionEnd