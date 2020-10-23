import { findDOMNode, getOptionProps, hasProp } from '../util/props-util';
import { cloneElement } from '../util/vnode';
import PropTypes from '../util/vue-types';
import addEventListener from '../util/dom/addDOMEventListener';
import contains from '../util/dom/contains';
import placements from './placements';
import getPlacements from './getPlacements';
import { Teleport } from 'vue';
import Popup from '../Popup';
import abstractTooltipProps from './abstractTooltipProps';

function noop() {}

function returnDocument() {
  return window.document;
}

const props = abstractTooltipProps();

export default {
  name: 'Tooltip',
  inheritAttrs: false,
  props: {
    ...props,
  },

  data() {
    return {
      popupVisible: this.$props.visible,
    };
  },

  created() {
    this.getPopupContainer();
  },

  mounted() {
    this.updatedCal();
    console.log(this.placement);
  },

  methods: {
    updatedCal() {
      let document = returnDocument();

      addEventListener(document, 'mousedown', this.onDocumentClick);
    },

    getPopupContainer() {
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

    getPopupComponent() {
      const { popupContainer, popupVisible, $props: props } = this;

      const popupProps = {
        ...props,
        visible: popupVisible,
        getContainer: () => popupContainer,
        getRootNodeDOM: () => findDOMNode(this),
        getArrowNodeDOM: () => this.$refs.arrow,
      };

      return <Popup {...popupProps}>{this.getPopupElement()}</Popup>;
    },

    getPopupElement() {
      const { prefixCls, tipId, backgroundColor } = this.$props;
      return [
        <div class={`${prefixCls}-arrow`} key="arrow" ref="arrow">
          <div
            class={`${prefixCls}-arrow-inner`}
            style={{ backgroundColor: backgroundColor }}
          ></div>
        </div>,
        <div class={`${prefixCls}-inner`} id={tipId} style={{ backgroundColor: backgroundColor }}>
          {this.$slots.title()}
        </div>,
      ];
    },

    open() {
      this.popupVisible = true;
    },

    close() {
      this.popupVisible = false;
    },

    onClick(event) {
      event.preventDefault();
      this.open();
    },

    onDocumentClick() {
      const target = event.target;
      const root = findDOMNode(this);
      if (!contains(root, target)) {
        this.close();
      }
    },
  },

  render() {
    const teleport = <Teleport to={this.popupContainer}>{this.getPopupComponent()}</Teleport>;
    const slots = this.$slots.default();
    const child = slots[0];

    const newChildProps = {};
    newChildProps.onClick = this.onClick;

    const cloneChild = cloneElement(child, newChildProps);

    return [teleport, cloneChild];
  },
};
