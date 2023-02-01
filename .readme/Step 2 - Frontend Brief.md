# Social Places
## Step 2 - Frontend Brief
### What to do?
1. Using Vuetify together with the theme of the mock login page create a profile page that loads in dummy user data
   1. Should load in information that could be expected on a typical user profile.
      1. Including a profile picture, name and other information
   2. Use a service to provide dummy API data, something like [dummyJSON](https://dummyjson.com/), [Reqres](https://reqres.in/) or even your own service.
      1. Noting that it may be tough to test posting information to such an endpoint, [Reqres](https://reqres.in/) will give you dummy responses to be able to proceed.
   3. Be mindful of loading states, HTTP codes and necessary validation for the necessary form elements.
   4. Please use of the components and libraries provided as well as showcasing your own ability to create your own components.
2. Provide some tests showcasing the use of custom components working and some potential shortcomings\failures using chai
3. Write a basic E2E test using [cypress](https://www.cypress.io/) of your workflow

[Step 3 - Completion](./Step%203%20-%20Completion.md)

### Testing
To run the tests, run `npm run test:unit` for the unit tests and the `npm run test:e2e` for the end-to-end testing.