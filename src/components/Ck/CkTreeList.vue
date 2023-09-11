<template>
  <gov-list :bullet="bullet">
    <li v-for="node in nodes" :key="node.id">
      <slot name="label" :node="node">{{ node.label }}</slot
      >&nbsp;
      <span>
        <slot name="edit" :node="node">
          <gov-link
            v-if="canEdit"
            :to="{
              name: edit,
              params: { [nodeType]: node.id }
            }"
          >
            Edit
          </gov-link> </slot
        >&nbsp;
        <slot name="moveUp" :node="node">
          <gov-link @click="$emit('move-up', node)" v-if="node.order > 0"
            >(Move up)</gov-link
          > </slot
        >&nbsp;
        <slot name="moveDown" :node="node">
          <gov-link
            @click="$emit('move-down', node)"
            v-if="node.order < nodes.length - 1"
            >(Move down)</gov-link
          > </slot
        >&nbsp;
        <slot name="status" :node="node"></slot>
      </span>
      <slot>
        <ck-tree-list
          v-if="node.children"
          :key="`node.${node.id}.children`"
          :nodes="node.children"
          :edit="edit"
          :nodeType="nodeType"
          :bullet="bullet"
          @move-up="$emit('move-up', $event)"
          @move-down="$emit('move-down', $event)"
        >
          <template
            v-for="(_, name) in $scopedSlots"
            :slot="name"
            slot-scope="statusProps"
          >
            <slot :name="name" :node="statusProps.node"></slot>
          </template>
        </ck-tree-list>
      </slot>
    </li>
  </gov-list>
</template>

<script>
export default {
  name: "CkTreeList",

  props: {
    nodes: {
      required: true,
      type: Array
    },
    nodeType: {
      type: String,
      default: ""
    },
    edit: {
      type: String,
      default: ""
    },
    bullet: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    canEdit() {
      return this.edit.length > 0 && this.nodeType.length > 0;
    }
  }
};
</script>

<style lang="scss" scoped></style>
