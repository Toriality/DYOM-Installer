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

SectionGroup "DYOM Add-ons" SIZZZ
	Section "DYOM#" DYOM_Sharp
		SetOutPath "$INSTDIR2\modloader\"
		File /r ".\_DYOM_ADDONS\DYOM Sharp"
		StrCpy $7 '"DYOM_Sharp"'
	SectionEnd

	Section "Time selection in milliseconds" TimeMs
		File /r ".\_DYOM_ADDONS\Time Selection in Milliseconds"
		StrCpy $7 '"TimeMs"'
	SectionEnd

	Section "SA:MP Objects" SAMP
		File /r ".\_DYOM_ADDONS\SAMP Objects"
		StrCpy $7 '"SAMP"'
	SectionEnd
SectionGroupEnd

# Sections descriptions
  !insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
	!insertmacro MUI_DESCRIPTION_TEXT ${DYOM} "Design Your Own Mission Files"
    !insertmacro MUI_DESCRIPTION_TEXT ${DYOM_Files} "All the files necessary for running Design Your Own Mission 8.1 modification. They are installed into your GTA San Andreas User Files directory."
	!insertmacro MUI_DESCRIPTION_TEXT ${DYOM_Dependencies} "All the dependencies needed to run DYOM without crashes and major issues. They are installed into your GTA San Andreas root directory."
	!insertmacro MUI_DESCRIPTION_TEXT ${DYOM_Sharp} "An extensive script that adds many new features, new tools and fixes some bugs. With this add-on, designing mission will be more efficient and fast.$\n$\nAuthor: SIZZZ"
	!insertmacro MUI_DESCRIPTION_TEXT ${TimeMs} "Adds the useful hability to select the time in milliseconds, for microadjusting cutscenes and other objectives' timings.$\n$\nAuthor: ZeroRaxo"
	!insertmacro MUI_DESCRIPTION_TEXT ${SAMP} "Adds about 1500 new objects into the game. DYOM# is required to use the new objects.$\n$\nAuthor: Kunamon"
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
	${locate::Open} "${STEAM_DIR}|${MIXMODS_DIR}|${OTHER_DIR_STEAM}|${DEFAULT_DIR}" `\
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
	FileOpen $8 "$INSTDIR\DYOM\user.json" w
	# JSON syntax requires forward slashes (/)
	${StrRep} $0 "$INSTDIR" "\" "/"
	${StrRep} $1 "$INSTDIR2" "\" "/"
	# Writes into the created .json file the installed addons
	FileWrite $8 `{$\n$\t\
						"version": "$VERSION",$\n$\t\
						"instDir": "$0",$\n$\t\
						"instDir2": "$1",$\n$\t\
					}`
	FileClose $8
FunctionEnd







