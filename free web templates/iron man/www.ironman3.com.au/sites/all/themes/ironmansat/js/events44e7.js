var events = {
//Events that are not tabbed in have either not been added or not been tested.
    /* AWARENESS OF BOX OFFICE RELEASE */
    'SET_REMINDER_OPEN' : ['_trackEvent', 'Release Awareness', 'Button click', 'SetReminderOpen'],
    'SET_REMINDER_CLOSE' : ['_trackEvent', 'Release Awareness', 'Button click', 'SetReminderClose'],
    'SET_REMINDER_SUBMIT': ['_trackEvent', 'Release Awareness', 'Button click', 'SetReminderSubmit'],
    'REMINDER_PANEL_CLOSE': ['_trackEvent', 'Release Awareness', 'Button click', 'ReminderPanelClose'],


    /* TICKET SALE REFERRALS */
   'CINEMA_REFERRAL' : ['_trackEvent', 'Release Awareness', 'Button click', 'Cinema Referral ({{DATA}})'],

    /* CONVERSION OF USER TO MARVEL VIP */
   'VIP_SIGNUP' : ['_trackEvent', 'VIP Conversion', 'Button click', 'VIP Signup Complete'],
   'VIP_REGISTER' : ['_trackEvent', 'VIP Conversion', 'Button click', 'VIP Register Today'],
   //This next one should have a dynamic component...
	'VIP_REGISTER_ERROR' : ['_trackEvent', 'Form Errors', 'Form Error', 'Error: {{DATA}}'],

    /* ENGAGEMENT OF MARVEL VIP ON SITE  */
   'WATCH_TRAILER' : ['_trackEvent', 'Interaction', 'Button click', 'Watch Trailer'],
   'PLAY_GAME' : ['_trackEvent', 'Interaction', 'Button click', 'Play Game'],
   'KEEP_PLAYING_GAME' : ['_trackEvent', 'Interaction', 'Button click', 'Keep Playing Game'],
   'STORY_TAB_CLICK' : ['_trackEvent', 'Interaction', 'Button click', 'Story Tab'],
   'CAST_TAB_CLICK' : ['_trackEvent', 'Interaction', 'Button click', 'Cast Tab'],
   'CAST_CHARACTER_CLICK' : ['_trackEvent', 'Interaction', 'Button click', 'Cast Character Select: {{DATA}}'],
   'CAST_INFO_SCROLL' : ['_trackEvent', 'Interaction', 'Scroll', 'Cast Character Info Scroll'],
   'CAST_PREVIOUS' : ['_trackEvent', 'Interaction', 'Button click', 'Cast Previous'],
   'CAST_NEXT' : ['_trackEvent', 'Interaction', 'Button click', 'Cast Next'],
   'WATCH_THUMBNAIL' : ['_trackEvent', 'Interaction', 'Thumbnail Select', 'Watch'],
   'WATCH_PREVIOUS' : ['_trackEvent', 'Interaction', 'Button click', 'Watch Previous'],
   'WATCH_NEXT' : ['_trackEvent', 'Interaction', 'Button click', 'Watch Next'],
   'CINEMA_SCROLL' : ['_trackEvent', 'Interaction', 'Scroll', 'Find a cinema scroll'],
   'FACEBOOK_TAB_CLICK' : ['_trackEvent', 'Interaction', 'Button click', 'Facebook Tab'],
   'SHARE_TAB_CLICK' : ['_trackEvent', 'Interaction', 'Button click', 'Share Tab'],
    //These next two may be able to be tracked by Facebook, talk to Mark about it.
'FACEBOOK_FOLLOW' : ['_trackEvent', 'Interaction', 'Button click', 'Facebook Follow'],
'FACEBOOK_LIKE' : ['_trackEvent', 'Interaction', 'Social Share', 'Like'],
   //This may be able to be tracked by Twitter
	'TWEET_CLICK' : ['_trackEvent', 'Interaction', 'Social Share', 'Tweet'],
   //This should show up in the Google analytics automatically, but is in here anyway - just in case.
	'GOOGLE_PLUSONE_CLICK' : ['_trackEvent', 'Interaction', 'Social Share', 'Google'],
'PINTEREST_CLICK' : ['_trackEvent', 'Interaction', 'Social Share', 'Pin'],
   'GALLERY_THUMBNAIL_CLICK' : ['_trackEvent', 'Interaction', 'Thumbnail Select', 'Gallery: {{DATA}}'],
   'GALLERY_PREVIOUS' : ['_trackEvent', 'Interaction', 'Button click', 'Gallery Previous'],
   'GALLERY_NEXT' : ['_trackEvent', 'Interaction', 'Button click', 'Gallery Next'],
	'DOWNLOADS_SCROLL' : ['_trackEvent', 'Interaction', 'Scroll', 'Downloads'],
   //The next four events should have some kind of dynamic component when I work out how to do this
   'DOWNLOAD_WALLPAPER' : ['_trackEvent', 'Interaction', 'Download', 'Download wallpaper: {{DATA}}'],
   'DOWNLOAD_FACEBOOK' : ['_trackEvent', 'Interaction', 'Download', 'Download Facebook: {{DATA}}'],
   'DOWNLOAD_IPAD' : ['_trackEvent', 'Interaction', 'Download', 'Download iPad: {{DATA}}'],
   'DOWNLOAD_IPHONE' : ['_trackEvent', 'Interaction', 'Download',  'Download iPhone: {{DATA}}'],
	'VIP_LOGIN' : ['_trackEvent', 'Interaction', 'Button click', 'Login'],
	'VIP_FORGOTPASSWORD' : ['_trackEvent', 'Interaction', 'Button click', 'Forgot Password'],
	'TERMS_SCROLL' : ['_trackEvent', 'Interaction', 'Scroll', 'Terms and conditions'],
	'PRIVACY_SCROLL' : ['_trackEvent', 'Interaction', 'Scroll', 'Privacy'],


    /* NAV CLICKS */
   'LOGO_NAV_CLICK' : ['_trackEvent', 'TopNavigation select', 'TopNavigation select', 'Logo'],
   'HOME_NAV_CLICK' : ['_trackEvent', 'TopNavigation select', 'TopNavigation select', 'Home'],
   'SUITUP_NAV_CLICK' : ['_trackEvent', 'WebsiteUX', 'TopNavigation select', 'Game'],
   'WIN_NAV_CLICK' : ['_trackEvent', 'WebsiteUX', 'TopNavigation select', 'Win'],
   'STORY_NAV_CLICK' : ['_trackEvent', 'WebsiteUX', 'TopNavigation select', 'StoryCast'],
   'WATCH_NAV_CLICK' :['_trackEvent', 'WebsiteUX', 'TopNavigation select', 'Watch'],
   'CINEMA_NAV_CLICK' :['_trackEvent', 'WebsiteUX', 'TopNavigation select', 'FindACinema'],
   'RETAILER_NAV_CLICK' :['_trackEvent', 'WebsiteUX', 'TopNavigation select', 'FindARetailer'],
   'SOCIAL_NAV_CLICK' : ['_trackEvent', 'WebsiteUX', 'TopNavigation select', 'Social'],
   'GALLERY_NAV_CLICK' : ['_trackEvent', 'WebsiteUX', 'TopNavigation select', 'Gallery'],
   'DOWNLOADS_NAV_CLICK' : ['_trackEvent', 'WebsiteUX', 'TopNavigation select', 'Downloads'],


    /* DEVICE MODE CHANGES */
	'DEVICE_MODE_CHANGE' : ['_trackEvent', 'WebsiteUX', 'Device mode change', '{{DATA}}']

    //Make sure the final comma is removed!

};




