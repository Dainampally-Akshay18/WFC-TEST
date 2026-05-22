```bash id="mtr2pf"
church-admin-frontend/
│
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── manifest.json
│
├── src/
│
│   ├── api/
│   │   │
│   │   ├── client/
│   │   │   └── axiosClient.js
│   │   │
│   │   ├── config/
│   │   │   ├── apiConfig.js
│   │   │   └── apiVersions.js
│   │   │
│   │   ├── endpoints/
│   │   │   ├── auth.endpoints.js
│   │   │   ├── user.endpoints.js
│   │   │   ├── event.endpoints.js
│   │   │   ├── blog.endpoints.js
│   │   │   ├── sermon.endpoints.js
│   │   │   ├── prayer.endpoints.js
│   │   │   ├── notification.endpoints.js
│   │   │   ├── branch.endpoints.js
│   │   │   ├── dashboard.endpoints.js
│   │   │   ├── audit.endpoints.js
│   │   │   └── upload.endpoints.js
│   │   │
│   │   ├── interceptors/
│   │   │   ├── authInterceptor.js
│   │   │   ├── errorInterceptor.js
│   │   │   ├── refreshInterceptor.js
│   │   │   └── responseInterceptor.js
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── user.service.js
│   │   │   ├── dashboard.service.js
│   │   │   ├── event.service.js
│   │   │   ├── blog.service.js
│   │   │   ├── sermon.service.js
│   │   │   ├── prayer.service.js
│   │   │   ├── notification.service.js
│   │   │   ├── branch.service.js
│   │   │   ├── audit.service.js
│   │   │   └── upload.service.js
│   │   │
│   │   ├── mocks/
│   │   │   └── mockData.js
│   │   │
│   │   ├── utils/
│   │   │   ├── tokenManager.js
│   │   │   ├── apiErrorHandler.js
│   │   │   ├── responseFormatter.js
│   │   │   └── requestBuilder.js
│   │   │
│   │   └── index.js
│   │
│   ├── assets/
│   │   │
│   │   ├── icons/
│   │   │   ├── sidebar/
│   │   │   ├── navbar/
│   │   │   └── status/
│   │   │
│   │   ├── images/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   └── placeholders/
│   │   │
│   │   ├── logos/
│   │   │   ├── dark-logo.svg
│   │   │   ├── light-logo.svg
│   │   │   └── icon-logo.svg
│   │   │
│   │   ├── illustrations/
│   │   └── animations/
│   │
│   ├── config/
│   │   ├── env.js
│   │   ├── queryClient.js
│   │   ├── appConfig.js
│   │   ├── editorConfig.js
│   │   └── chartConfig.js
│   │
│   ├── constants/
│   │   ├── roles.js
│   │   ├── permissions.js
│   │   ├── routes.js
│   │   ├── queryKeys.js
│   │   ├── tableColumns.js
│   │   ├── statuses.js
│   │   ├── eventVisibility.js
│   │   ├── notificationTypes.js
│   │   └── appConstants.js
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── SocketContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useTheme.js
│   │   ├── useDebounce.js
│   │   ├── usePermissions.js
│   │   ├── usePagination.js
│   │   ├── useModal.js
│   │   ├── useDisclosure.js
│   │   ├── useLocalStorage.js
│   │   ├── useSearch.js
│   │   └── useInfiniteScroll.js
│   │
│   ├── layouts/
│   │   │
│   │   ├── admin/
│   │   │   │
│   │   │   ├── components/
│   │   │   │   │
│   │   │   │   ├── sidebar/
│   │   │   │   │   ├── Sidebar.jsx
│   │   │   │   │   ├── SidebarItem.jsx
│   │   │   │   │   ├── SidebarGroup.jsx
│   │   │   │   │   ├── SidebarFooter.jsx
│   │   │   │   │   ├── SidebarCollapse.jsx
│   │   │   │   │   └── MobileSidebar.jsx
│   │   │   │   │
│   │   │   │   ├── navbar/
│   │   │   │   │   ├── Navbar.jsx
│   │   │   │   │   ├── SearchBar.jsx
│   │   │   │   │   ├── NotificationDropdown.jsx
│   │   │   │   │   ├── UserMenu.jsx
│   │   │   │   │   ├── ThemeToggle.jsx
│   │   │   │   │   └── NavbarActions.jsx
│   │   │   │   │
│   │   │   │   ├── header/
│   │   │   │   │   ├── PageHeader.jsx
│   │   │   │   │   ├── Breadcrumbs.jsx
│   │   │   │   │   └── PageActions.jsx
│   │   │   │   │
│   │   │   │   ├── shell/
│   │   │   │   │   ├── LayoutShell.jsx
│   │   │   │   │   ├── MainContent.jsx
│   │   │   │   │   ├── PageContainer.jsx
│   │   │   │   │   └── ContentWrapper.jsx
│   │   │   │   │
│   │   │   │   └── shared/
│   │   │   │       ├── Logo.jsx
│   │   │   │       ├── LoadingScreen.jsx
│   │   │   │       ├── EmptyState.jsx
│   │   │   │       └── AccessDenied.jsx
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useSidebar.js
│   │   │   │   ├── useNavbar.js
│   │   │   │   └── useLayout.js
│   │   │   │
│   │   │   ├── config/
│   │   │   │   ├── sidebar.config.js
│   │   │   │   ├── navbar.config.js
│   │   │   │   └── navigation.config.js
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   ├── sidebarHelpers.js
│   │   │   │   └── navigationHelpers.js
│   │   │   │
│   │   │   └── AdminLayout.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── AuthCard.jsx
│   │   │   │   ├── AuthBackground.jsx
│   │   │   │   └── AuthLogo.jsx
│   │   │   │
│   │   │   └── AuthLayout.jsx
│   │   │
│   │   ├── minimal/
│   │   │   └── MinimalLayout.jsx
│   │   │
│   │   └── dashboard/
│   │       └── DashboardLayout.jsx
│   │
│   ├── lib/
│   │   ├── axios.js
│   │   ├── reactQuery.js
│   │   ├── storage.js
│   │   ├── socket.js
│   │   └── clsx.js
│   │
│   ├── pages/
│   │   │
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── validations/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   └── VerifyOtp.jsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── AnalyticsCard.jsx
│   │   │   │   ├── RecentActivities.jsx
│   │   │   │   ├── DashboardCharts.jsx
│   │   │   │   └── OverviewCards.jsx
│   │   │   │
│   │   │   ├── hooks/
│   │   │   ├── DashboardHome.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── Reports.jsx
│   │   │
│   │   ├── users/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── validations/
│   │   │   ├── utils/
│   │   │   ├── UserList.jsx
│   │   │   ├── UserDetails.jsx
│   │   │   ├── CreateUser.jsx
│   │   │   ├── EditUser.jsx
│   │   │   └── UserApproval.jsx
│   │   │
│   │   ├── events/
│   │   │   ├── components/
│   │   │   │   ├── EventForm.jsx
│   │   │   │   ├── EventTable.jsx
│   │   │   │   ├── EventFilters.jsx
│   │   │   │   ├── EventCard.jsx
│   │   │   │   ├── EventStatusBadge.jsx
│   │   │   │   └── EventActions.jsx
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useEvents.js
│   │   │   │   └── useEventMutations.js
│   │   │   │
│   │   │   ├── validations/
│   │   │   │   └── event.schema.js
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   └── eventHelpers.js
│   │   │   │
│   │   │   ├── EventList.jsx
│   │   │   ├── CreateEvent.jsx
│   │   │   ├── EditEvent.jsx
│   │   │   └── EventDetails.jsx
│   │   │
│   │   ├── blogs/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── validations/
│   │   │   ├── utils/
│   │   │   ├── BlogList.jsx
│   │   │   ├── CreateBlog.jsx
│   │   │   ├── EditBlog.jsx
│   │   │   └── BlogDetails.jsx
│   │   │
│   │   ├── sermons/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── validations/
│   │   │   ├── utils/
│   │   │   ├── SermonList.jsx
│   │   │   ├── CreateSermon.jsx
│   │   │   ├── EditSermon.jsx
│   │   │   ├── SermonDetails.jsx
│   │   │   └── SermonCategories.jsx
│   │   │
│   │   ├── prayers/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── validations/
│   │   │   ├── utils/
│   │   │   ├── PrayerList.jsx
│   │   │   ├── CreatePrayer.jsx
│   │   │   ├── PrayerDetails.jsx
│   │   │   └── PrayerModeration.jsx
│   │   │
│   │   ├── notifications/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── NotificationList.jsx
│   │   │   └── NotificationCenter.jsx
│   │   │
│   │   ├── branches/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── validations/
│   │   │   ├── BranchList.jsx
│   │   │   ├── CreateBranch.jsx
│   │   │   └── EditBranch.jsx
│   │   │
│   │   ├── audit-logs/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── AuditLogs.jsx
│   │   │
│   │   ├── settings/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── GeneralSettings.jsx
│   │   │   ├── AppearanceSettings.jsx
│   │   │   └── SecuritySettings.jsx
│   │   │
│   │   ├── profile/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── Profile.jsx
│   │   │   └── EditProfile.jsx
│   │   │
│   │   └── errors/
│   │       ├── NotFound.jsx
│   │       ├── Forbidden.jsx
│   │       ├── Unauthorized.jsx
│   │       └── ServerError.jsx
│   │
│   ├── routes/
│   │   ├── AppRouter.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── PublicRoute.jsx
│   │   ├── RoleBasedRoute.jsx
│   │   └── routeConfig.jsx
│   │
│   ├── store/
│   │   ├── authStore.js
│   │   ├── themeStore.js
│   │   ├── notificationStore.js
│   │   ├── sidebarStore.js
│   │   ├── modalStore.js
│   │   ├── userStore.js
│   │   └── appStore.js
│   │
│   ├── theme/
│   │   ├── colors/
│   │   ├── gradients/
│   │   ├── glass/
│   │   ├── shadows/
│   │   ├── typography/
│   │   ├── spacing/
│   │   ├── radius/
│   │   ├── animations/
│   │   ├── themes/
│   │   ├── css/
│   │   └── index.js
│   │
│   ├── utils/
│   │   ├── date.js
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   ├── permissions.js
│   │   ├── storage.js
│   │   ├── toast.js
│   │   ├── download.js
│   │   ├── upload.js
│   │   ├── debounce.js
│   │   └── cn.js
│   │
│   ├── validations/
│   │   ├── auth.schema.js
│   │   ├── common.schema.js
│   │   └── fileUpload.schema.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── .env.development
├── .env.production
├── .gitignore
├── jsconfig.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── package.json
└── README.md
```
