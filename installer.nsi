!include "MUI2.nsh"		# Modern UI 2
!include "Locate.nsh"	# Locate Plugin 
!include "LogicLib.nsh"	# LogicLib
!include "StrFunc.nsh"	# String functions

# Initialize String Functions
${StrRep}

# Set the basic information
Name "DYOM 8.1"
OutFile "DYOM Setup.exe"
BrandingText "Made by Toriality"
Unicode True
InstallDir "$DOCUMENTS\GTA San Andreas User Files"
RequestExecutionLevel admin

# Variables
Var INSTDIR2
Var IS_STEAM_GTASA ; steam's version exe is gta-sa instead of gta_sa
Var INSTALLED_ADDONS ; list of addons installed by user
Var VERSION

# Most common directories where GTA SA can be found
# Default installation directory from GTA SA setup
!define DEFAULT_DIR "$PROGRAMFILES\Rockstar Games\GTA San Andreas\"
# Default installation directory from Steam version
!define STEAM_DIR "$PROGRAMFILES\Steam\steamapps\common\Grand Theft Auto San Andreas"
!define OTHER_DIR_STEAM "D:\SteamLibrary\steamapps\common\Grand Theft Auto San Andrea"
# MixMods recommend users to install their GTA SA folder into Documents
!define MIXMODS_DIR "$DOCUMENTS"

# Set MUI customizations
!define MUI_ABORTWARNING
!define MUI_BGCOLOR FFEECC
!define MUI_DIRECTORYPAGE_BGCOLOR FFEECCF
!define MUI_ICON "./dyom_icon.ico"
!define MUI_HEADERIMAGE_BITMAP "./header.bmp"
!define MUI_HEADERIMAGE_BITMAP_NOSTRETCH

# Start Components Page
!insertmacro MUI_PAGE_COMPONENTS

# First directory page.
# GTA San Andreas User Files
!define MUI_PAGE_HEADER_TEXT "GTA San Andreas: User Files Location"
!define MUI_PAGE_HEADER_SUBTEXT "Enter your GTASA User Files directory location"
!define MUI_DIRECTORYPAGE_TEXT_TOP "This folder is normally located at My Documents\GTA San Andreas User Files\.$\r$\n$\r$\nIf you have PortableGTA modification, your User Files is normally located at game's root directory. " 
!define MUI_DIRECTORYPAGE_TEXT_DESTINATION  "GTA San Andreas User Files"
!insertmacro MUI_PAGE_DIRECTORY

# Second directory page.
# GTA San Andreas Root Folder
!define MUI_DIRECTORYPAGE_VARIABLE $INSTDIR2
!define MUI_PAGE_CUSTOMFUNCTION_LEAVE DirectoryLeave
!define MUI_PAGE_HEADER_TEXT "GTA San Andreas Root Directory"
!define MUI_PAGE_HEADER_SUBTEXT "Enter your GTASA directory where your GTA_SA.exe is located"
!define MUI_DIRECTORYPAGE_TEXT_TOP "This folder is normally located at C:\Program Files(x86)\Rockstar Games\GTA San Andreas\$\r$\n$\r$\nIf you have the Steam Version it is normally located at:$\r$\nC:\Program Files(x86)\Steam\steamapps\common\Grand Theft Auto San Andreas\.$\r$\n$\r$\nIf you installed your game in another location, please insert this location in the input box bellow."
!define MUI_DIRECTORYPAGE_TEXT_DESTINATION  "GTA San Andreas Folder"
!insertmacro MUI_PAGE_DIRECTORY


Function DirectoryLeave
	# Detect if the inserted directory contains the GTA_SA.exe
	# If there is no such file, the user will be prompted 
	# to insert a valid folder
	IfFileExists "$INSTDIR2/GTA?SA.exe" PathGood 0
		MessageBox MB_OK|MB_ICONEXCLAMATION "Invalid folder! GTA_SA.exe was not found in the selected directory." IDOK retry
		retry:
			Abort
	PathGood:
		# Checks if the GTA executable is "gta-sa.exe" - which is different from
		# our executable (GTA_SA.exe), if so, sets IS_STEAM_GTASA variable to true,
		# so we can delete the executable later when installing DYOM
		IfFileExists "$INSTDIR2/gta-sa.exe" ShouldDelete ShouldContinue
		ShouldDelete:
			StrCpy $IS_STEAM_GTASA "True"
		ShouldContinue:
			MessageBox MB_YESNO "GTA SA Root set to:$\r$\n$INSTDIR2$\r$\nGTA SA User Files set to:$\r$\n$INSTDIR$\r$\nIs this correct?" IDYES 0 IDNO retry
FunctionEnd

# Install page
!insertmacro MUI_PAGE_INSTFILES

# Set default language as English
!insertmacro MUI_LANGUAGE "English"

# Sections
SectionGroup "DYOM 8.1" DYOM
	Section "DYOM Required Files" DYOM_Files
		SectionIn 1
		SetOutPath "$INSTDIR"
		File /r ".\_DYOM_FILES\"
		SectionEnd

	Section "DYOM Dependencies" DYOM_Dependencies
		SectionIn 2
		SetOutPath "$INSTDIR2"
		# If IS_STEAM_GTASA was set to true during .onInit,
		# the "gta-sa.exe" must be removed and replaced by a 1.0 version
		# of "GTA_SA.exe" renamed to "gta-sa.exe"
		StrCmp $IS_STEAM_GTASA "True" StartDelete SkipDelete
		StartDelete:
			Delete "$INSTDIR2\gta-sa.exe"
			File /r ".\_DYOM_DEPENDENCIES\"
			Rename "$INSTDIR2\GTA_SA.exe" "$INSTDIR2\gta-sa.exe"
			Goto +3
		SkipDelete:
		File /r ".\_DYOM_DEPENDENCIES\"
		SectionEnd
SectionGroupEnd

SectionGroup "SIZZZ's Addons" SIZZZ
	Section "DYOM#" DYOM_Sharp
		SetOutPath "$INSTDIR2\modloader\"
		File /r ".\SIZZZ\DYOM Sharp"
		;if installed_addons = '', add raw data
		;if installed_addons not '' format then write
		StrCpy $7 '"DYOM_Sharp"'
		Call WriteJSON
	SectionEnd
	
	Section "Machine Gun" MachineGun
		File /r ".\SIZZZ\Machine Gun"
		StrCpy $7 '"MachineGun"'
		Call WriteJSON

	SectionEnd

	Section "Darkness Effect" DarkEffect
		File /r ".\SIZZZ\Darkness Effect"
		StrCpy $7 '"DarkEffect"'
		Call WriteJSON
	SectionEnd
	

	Section "Working Dynamites" WDynamites
		File /r ".\SIZZZ\Working Dynamites"
		StrCpy $7 '"WDynamites"'
		Call WriteJSON
	SectionEnd

	Section "Road Spikes" RoadSpikes
		File /r ".\SIZZZ\Road Spikes"
		StrCpy $7 '"RoadSpikes"'
		Call WriteJSON
	SectionEnd

	Section "Disable teleport health regeneration" TeleportHealth
		File /r ".\SIZZZ\Disable TP Health Regen"
		StrCpy $7 '"TeleportHealth"'
		Call WriteJSON
	SectionEnd

	Section "CCTV Cameras" CCTV
		File /r ".\SIZZZ\CCTV Camera"
		StrCpy $7 '"CCTV"'
		Call WriteJSON
	SectionEnd

	Section "Phone talk animation" PhoneAnim
		File /r ".\SIZZZ\Phone Animation"
		StrCpy $7 '"PhoneAnim"'
		Call WriteJSON
	SectionEnd

	Section "Weapon Shops" WeaponShops
		File /r ".\SIZZZ\Weapon Shops"
		StrCpy $7 '"WeaponShops"'
		Call WriteJSON
	SectionEnd
SectionGroupEnd

SectionGroup "Axoez's Addons" Axoez
	Section "Time selection in milliseconds" TimeMs
		File /r ".\AXOEZ\Time Selection in Milliseconds"
		StrCpy $7 '"TimeMs"'
		Call WriteJSON
	SectionEnd
	
	Section "Phonecall Skip" PhoneSkip
		File /r ".\AXOEZ\Phonecall Skip"
		StrCpy $7 '"PhoneSkip"'
		Call WriteJSON
	SectionEnd
SectionGroupEnd

SectionGroup "Kumamon's Addons" Kumamon
	Section "SA:MP Objects" SAMP
		File /r ".\KUMAMON\SAMP Objects"
		StrCpy $7 '"SAMP"'
		Call WriteJSON
	SectionEnd
SectionGroupEnd

# Sections descriptions
  !insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
	!insertmacro MUI_DESCRIPTION_TEXT ${DYOM} "Design Your Own Mission Files"
    !insertmacro MUI_DESCRIPTION_TEXT ${DYOM_Files} "All the files necessary for running Design Your Own Mission 8.1 modification. They are installed into your GTA San Andreas User Files directory."
	!insertmacro MUI_DESCRIPTION_TEXT ${DYOM_Dependencies} "All the dependencies needed to run DYOM without crashes and major issues. They are installed into your GTA San Andreas root directory."
	!insertmacro MUI_DESCRIPTION_TEXT ${SIZZZ} "Add-ons made by SIZZZ."
	!insertmacro MUI_DESCRIPTION_TEXT ${DYOM_Sharp} "An extensive script that adds many new features, new tools and fixes some bugs. With this add-on, designing mission will be more efficient and fast."
	!insertmacro MUI_DESCRIPTION_TEXT ${MachineGun} "Adds a working machine gun to your missions."
	!insertmacro MUI_DESCRIPTION_TEXT ${DarkEffect} "Creates a very dark ambience effect when a certain weather is selected."
	!insertmacro MUI_DESCRIPTION_TEXT ${WDynamites} "The dynamite object explodes when the player gets near it."
	!insertmacro MUI_DESCRIPTION_TEXT ${RoadSpikes} "With this script, road spikes turn from an ordinary decoration into real working spikes."
	!insertmacro MUI_DESCRIPTION_TEXT ${TeleportHealth} "This will stop the player's health from regenerating when you have a teleport objective. With works if you teleport the player using the same skin."
	!insertmacro MUI_DESCRIPTION_TEXT ${CCTV} "A working CCTV camera that fails the mission if the players gets detected for a certain ammount of time inside the camera radius. Recommended for stealth missions."
	!insertmacro MUI_DESCRIPTION_TEXT ${PhoneAnim} "Adds a phone talking animation."
	!insertmacro MUI_DESCRIPTION_TEXT ${WeaponShops} "Adds the hability to have up to 5 weapons stores into your mission, where you can buy almost every kind of weapon."
	!insertmacro MUI_DESCRIPTION_TEXT ${Axoez} "Add-ons made by Axoez / RaXo."
	!insertmacro MUI_DESCRIPTION_TEXT ${TimeMs} "Adds the hability to select the time in milliseconds."
	!insertmacro MUI_DESCRIPTION_TEXT ${PhoneSkip} "With this script, you can skip the phonecalls. Recommended for missions with long phonecall dialogues."
	!insertmacro MUI_DESCRIPTION_TEXT ${Kumamon} "Add-ons made by Kumamon"
	!insertmacro MUI_DESCRIPTION_TEXT ${SAMP} "Adds about 1500 new objects into the game. DYOM# is required to use these objects."
  !insertmacro MUI_FUNCTION_DESCRIPTION_END
  

Function .onInit
	# Set the two first DYOM sections as required sections
	# These sections are needed to be installed because
	# 1. It installs the DYOM modification into User Files
	# 2. It installs the necessary dependencies for DYOM to work properly
	#		- CLEO 4 Library
	#		- SilentPatch
	#		- DYOM AudioFX (Since most designers use it already)
	#		- GTA_SA.exe 1.0
	#		- Modloader (Needed in order to load SilentPatch and AudioFX)
	SectionSetFlags ${DYOM_Files} 17
	SectionSetFlags ${DYOM_Dependencies} 17

	# DYOM VERSION
	StrCpy $VERSION '8.1'
	
	# Makes a search into the most common GTA installation folders to
	# check where the GTA_SA.exe (or gta-sa.exe) is located
	${locate::Open} "${STEAM_DIR}|${MIXMODS_DIR}|C:\|$PROGRAMFILES|${OTHER_DIR_STEAM}|D:\" `\
					/F=1 \
					/D=0 \
					/M=gta?sa.exe \
					/A=-HIDDEN|-SYSTEM \
					/-PN=Temp|WINDOWS` $0
					
	StrCmp $0 -1 0 loop

	loop:
	${locate::Find} $0 $1 $2 $3 $4 $5 $6
	#$var1        "path\name"
	#$var2        "path"
	#$var3        "name"
	#$var4        "size"       
	#$var5        "time"       
	#$var6        "attributes" 
	
	# Sets gta root folder (installdir2) to the path variable
	StrCpy $INSTDIR2 $2
	
	#Free memory
	${locate::Close} $0
	${locate::Unload}
FunctionEnd

Function .onInstSuccess
	# Creates a .JSON file to store all the install information
	# (i.e: addons installed, dyom version)
	FileOpen $8 "$INSTDIR\DYOM\INST.json" w
	# JSON syntax requires forward slashes (/)
	${StrRep} $0 "$INSTDIR" "\" "/"
	${StrRep} $1 "$INSTDIR2" "\" "/"
	# Writes into the created .json file the installed addons
	FileWrite $8 `{$\n$\t\
						"version": "$VERSION",$\n$\t\
						"instDir": "$0",$\n$\t\
						"instDir2": "$1",$\n$\t\
						"addons": [$INSTALLED_ADDONS],$\n$\t\
						"missions": [{"slot": 1}, {"slot": 2}, {"slot": 3}, {"slot": 4}, {"slot": 5}, {"slot": 6}, {"slot": 7}, {"slot": 8}]$\n\
					}`
	FileClose $8
FunctionEnd

Function WriteJSON
	# Function for formatting the data to be inserted into
	# the .json file
	StrCmp $INSTALLED_ADDONS '' WriteData FormatThenWrite
	WriteData:
		StrCpy $INSTALLED_ADDONS $7
		Return
	FormatThenWrite:
		StrCpy $INSTALLED_ADDONS '$INSTALLED_ADDONS, $7'
		Return
FunctionEnd
	









