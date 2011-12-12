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
      var request = '/findNearByWeatherJSON?lat=25.7902778&lng=-80.1302778'

      // London
      //var request = '/findNearByWeatherJSON?lat=51.5333&lng=-0'

      // Vancouver
      //var request = '/findNearByWeatherJSON?lat=49.2167&lng=-123.1'

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
; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('apache_demo');