# Start
ionic start OneKiosk blank --type=angular
cd ./OneKiosk

# Structure
ionic g page pages/login
ionic g page pages/dashboard
ionic g page pages/attendance
ionic g page pages/attendanceDetails
ionic g page pages/report

ionic g page pages/timetable
ionic g component pages/timetable/menu
ionic g component pages/timetable/edit
ionic g component pages/timetable/import

ionic g page pages/others

# Others Structure
ionic g page pages/subjects
ionic g page pages/faculty
ionic g page pages/fees
ionic g page pages/settings
ionic g page pages/database

# Settings Structure
ionic g page pages/settings/theming
ionic g component pages/settings/theming/colorBox
ionic g page pages/settings/apis
ionic g page pages/settings/webkiosk
ionic g page pages/settings/about


ionic g service services/storage
ionic g service services/timetable
ionic g service services/attendence
ionic g service services/attendence
ionic g service services/report
ionic g service services/subjects
ionic g service services/fees
ionic g service services/auth
ionic g service services/theme
ionic g service services/update
ionic g service services/faculty
ionic g service services/supabase

ionic g service preloading/custom.preloading

ionic g module components/sharedComponents --flat
ionic g component components/attendanceCard --change-detection=OnPush
ionic g component components/reportCard --change-detection=OnPush
ionic g component components/timetableCard --change-detection=OnPush
ionic g component components/semSelectBar --change-detection=OnPush
ionic g component components/noDataCard --change-detection=OnPush
ionic g component components/selectionPill --change-detection=OnPush

ionic g module directives/sharedDirectives --flat
ionic g directive directives/hideHeader

ng g interceptor interceptors/auth
ng g interceptor interceptors/api
ng g interceptor interceptors/timeout
ng g interceptor interceptors/retry

# Plugins
npm install @capacitor/haptics
npm install @capacitor/storage
# Optional Plugins
npm install @capacitor/splash-screen 

# External Libs
npm install @supabase/supabase-js
npm install ng-lazyload-image

# Add Android Platform
npm install @capacitor/android
npx cap add android

# Sync Android
ionic build && npx cap sync android