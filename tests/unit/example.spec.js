import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import AppBar from "@/components/layout/AppBar";

describe('AppBar.vue', () => {
  it('renders props.msg when passed', () => {
    const wrapper = mount(AppBar, {
      props: { sideBarState: 'full' }
    })
    expect(wrapper).to.include('fas fa-list-ul')
  })
})
