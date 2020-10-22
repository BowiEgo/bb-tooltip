import { Teleport } from 'vue';
import Popup from '../Popup';

function returnDocument() {
  return window.document;
}

export default {
  name: 'Trigger',

  methods: {
    getComponent() {
      const { popupContainer } = this;

      const popupProps = {
        container: popupContainer,
      };

      return <Popup {...popupProps}>{this.children}</Popup>;
    },

    getContainer() {
      const popupContainer = document.createElement('div');
      popupContainer.style.position = 'absolute';
      popupContainer.style.top = '0';
      popupContainer.style.left = '0';
      popupContainer.style.width = '100%';
      const mountNode = returnDocument().body;
      mountNode.appendChild(popupContainer);
      this.popupContainer = popupContainer;
      return popupContainer;
    },
  },

  render() {
    const teleport = <Teleport to={this.getContainer()}>{this.getComponent()}</Teleport>;
    const slots = this.$slots.default();

    return [teleport, slots];
  },
};
