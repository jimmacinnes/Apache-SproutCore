/* >>>>>>>>>> BEGIN source/core.js */
// ==========================================================================
// Project:   ApacheDemo
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals ApacheDemo */

/** @namespace

  My cool new app.  Describe your application.
  
  @extends SC.Object
*/
ApacheDemo = SC.Application.create(
  /** @scope ApacheDemo.prototype */ {

  NAMESPACE: 'ApacheDemo',
  VERSION: '0.1.0',

  // This is your application store.  You will use this store to access all
  // of your model data.  You can also set a data source on this store to
  // connect to a backend server.  The default setup below connects the store
  // to any fixtures you define.
  store: SC.Store.create().from('ApacheDemo.DataSource')
  
  // TODO: Add global constants or singleton objects needed by your app here.

}) ;

/* >>>>>>>>>> BEGIN source/resources/templates/apachedemo.handlebars */
SC.TEMPLATES["apachedemo"] = SC.Handlebars.compile("<h1>Weather Report</h1>\n\n{{#collection SC.TemplateCollectionView contentBinding=\"ApacheDemo.feedController\"}}\n  <h2>{{content.stationName}}</h2><p>\n  <b>Date:</b> {{content.datetime}}<br>\n  <b>Temperature:</b> {{content.temperature}}<br>\n  <b>Humidity:</b> {{content.humidity}}<br>\n  <b>Weather Condition:</b> {{content.weatherCondition}}<br>\n\n{{/collection}}\n");
/* >>>>>>>>>> BEGIN source/theme.js */
// ==========================================================================
// Project:   ApacheDemo
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals ApacheDemo */

// This is the theme that defines how your app renders.
//
// Your app is given its own theme so it is easier and less
// messy for you to override specific things just for your
// app.
//
// You don't have to create the whole theme on your own, though:
// your app's theme is based on SproutCore's Ace theme.
//
// NOTE: if you want to change the theme this one is based on, don't
// forget to change the :css_theme property in your buildfile.
ApacheDemo.Theme = SC.AceTheme.create({
  name: 'apache-demo'
});

// SproutCore needs to know that your app's theme exists
SC.Theme.addTheme(ApacheDemo.Theme);

// Setting it as the default theme makes every pane SproutCore
// creates default to this theme unless otherwise specified.
SC.defaultTheme = 'apache-demo';

/* >>>>>>>>>> BEGIN source/resources/main_page.js */
// ==========================================================================
// Project:   ApacheDemo - mainPage
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals ApacheDemo */

// This page describes the main user interface for your application.  
ApacheDemo.mainPage = SC.Page.design({

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    childViews: 'labelView'.w(),
    
    labelView: SC.LabelView.design({
      layout: { centerX: 0, centerY: 0, width: 200, height: 18 },
      textAlign: SC.ALIGN_CENTER,
      tagName: "h1", 
      value: "Welcome to SproutCore!"
    })
  })

});

/* >>>>>>>>>> BEGIN source/main.js */
// ==========================================================================
// Project:   ApacheDemo
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals ApacheDemo */

// This is the function that will start your app running.  The default
// implementation will load any fixtures you have created then instantiate
// your controllers and awake the elements on your page.
//
// As you develop your application you will probably want to override this.
// See comments for some pointers on what to do next.
//

ApacheDemo.Feed = SC.Record.extend({
});

ApacheDemo.DEMO_QUERY = SC.Query.local(ApacheDemo.Feed, {
});

ApacheDemo.DataSource = SC.DataSource.extend({
  fetch: function(store, query) {
    options = {
      store:    store,
      query:    query,
      isQuery:  YES
    };

    console.log("Doing Fetch.");
                   
    if(query === ApacheDemo.DEMO_QUERY) {

      // Miami
      //var request = '/findNearByWeatherJSON?lat=25.7902778&lng=-80.1302778'

      // London
      //var request = '/findNearByWeatherJSON?lat=51.5333&lng=-0'

      // Vancouver
      var request = '/findNearByWeatherJSON?lat=49.2167&lng=-123.1'

      SC.Request.getUrl(request)
        .set('isJSON', YES)
        .notify(this, '_didFetchFeed', options)
        .json()
        .send();
      return YES;
    }
    return NO;
  },
    
  _didFetchFeed: function(response, params) {
    var store = params.store,
        query = params.query;
        

    if (SC.ok(response)) {
      var content = response.get('body').weatherObservation;

      console.log(content);
      var array = [content];
      store.loadRecords(ApacheDemo.Feed, array);
      store.dataSourceDidFetchQuery(query);
   
    } else store.dataSourceDidErrorQuery(query, response);  }
        

  });


ApacheDemo.feedController = SC.ArrayController.create({
  content: []
  
});

ApacheDemo.main = function main() {

  console.log("Starting up.");

  // Step 1: Instantiate Your Views
  // The default code here will make the mainPane for your application visible
  // on screen.  If you app gets any level of complexity, you will probably 
  // create multiple pages and panes.  
  ApacheDemo.mainPane = SC.TemplatePane.append({
    layerId: 'apachedemo',
    templateName: 'apachedemo'
  });

  // Step 2. Set the content property on your primary controller.
  // This will make your app come alive!
  var weather = ApacheDemo.store.find(ApacheDemo.DEMO_QUERY);
  ApacheDemo.feedController.set('content', weather);


  // TODO: Set the content property on your primary controller
  // ex: ApacheDemo.contactsController.set('content',ApacheDemo.contacts);

} ;

function main() { ApacheDemo.main(); }

