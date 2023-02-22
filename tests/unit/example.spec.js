import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from "vuetify";
import AppBar from "@/components/layout/AppBar";

import Vue from 'vue'
import {RouterLink} from "vue-router";
Vue.use(Vuetify)
Vue.component('router-link', () => RouterLink);

describe('AppBar.vue', () => {
  const localVue = createLocalVue()

  let vuetify;
  beforeEach(() => {
    vuetify = new Vuetify()
  });

  it('renders when passed', () => {
    const wrapper = mount(AppBar, {
      localVue,
      vuetify,
      // router,
      propsData: { sideBarState: 'full' }
    })
    expect(wrapper.find('[data-testid="icon"]').classes()).toContain('fa-list-ul')
  })
})
