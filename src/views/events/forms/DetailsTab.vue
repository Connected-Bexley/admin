<template>
  <div>
    <template v-if="organisations">
      <ck-select-input
        :value="organisation_id"
        @input="onInput('organisation_id', $event)"
        id="organisation_id"
        label="Organisation*"
        hint="Which organisation hosts this event?"
        :options="organisations"
        :error="errors.get('organisation_id')"
      />
    </template>
    <ck-text-input
      :value="title"
      @input="onInput('title', $event)"
      id="title"
      label="Event title*"
      type="text"
      :error="errors.get('title')"
    />

    <ck-text-input
      :value="slug"
      @input="onInput('slug', $event)"
      id="slug"
      label="Unique slug"
      type="text"
      :error="errors.get('slug')"
    >
      <gov-hint slot="hint" for="slug">
        This will be used to access the event.<br />
        e.g. example.com/events/{{ slug }}
      </gov-hint>
    </ck-text-input>

    <ck-date-picker
      id="start_date"
      :value="start_date"
      :max="end_date"
      :required="true"
      :error="errors.get('start_date')"
      @input="onInput('start_date', $event)"
      label="Start date*"
    />

    <ck-date-picker
      id="end_date"
      :value="end_date"
      :min="earliestEndDate"
      :required="true"
      :error="errors.get('end_date')"
      @input="onInput('end_date', $event)"
      label="End date*"
    />

    <ck-time-period-input
      id="event_times"
      :opens_at="start_time"
      :closes_at="end_time"
      opens_at_label="Starting time*"
      closes_at_label="Ending time*"
      @update:opens_at="onInput('start_time', $event)"
      @update:closes_at="onInput('end_time', $event)"
      :error="errors.get(['start_time', 'end_time'])"
    />

    <ck-text-input
      :value="intro"
      @input="onInput('intro', $event)"
      id="intro"
      label="Event summary*"
      type="text"
      :error="errors.get('intro')"
    />

    <ck-wysiwyg-input
      :value="description"
      @input="onInput('description', $event)"
      id="description"
      label="Event description*"
      :hint="
        `Describe the event with any details that attendees will need to decide on, find and attend your event. Use headers, bullets and formatting for the maximum effect.`
      "
      :error="errors.get('description')"
      large
      :maxlength="10000"
    />

    <ck-radio-input
      :value="is_free"
      @input="onInput('is_free', $event)"
      id="is_free"
      label="Is the event free?*"
      :options="isFreeOptions"
      :error="errors.get('is_free')"
    >
      <template slot="hint">
        <gov-hint for="is_free">
          Indicates whether your event is completely free, or if some elements
          of the event must be paid for. Users can filter their searches based
          on the answer you provide.
        </gov-hint>
        <gov-hint for="is_free">
          If the cost of your event varies, you may want to split these into
          different event listings.
        </gov-hint>
      </template>
    </ck-radio-input>

    <gov-inset-text v-if="is_free === false">
      <ck-text-input
        :value="fees_text"
        @input="onInput('fees_text', $event)"
        id="fees_text"
        label="How much does it cost? (if applicable)"
        :hint="
          `Please indicate the basic cost of the event. If there are multiple price points, please provide an indicative range (eg. &quot;5-10 per session&quot;).`
        "
        type="text"
        :error="errors.get('fees_text')"
        :maxlength="75"
      />

      <ck-text-input
        :value="fees_url"
        @input="onInput('fees_url', $event)"
        id="fees_url"
        label="Please provide a link to full pricing table (if applicable)"
        type="url"
        :error="errors.get('fees_url')"
      />
    </gov-inset-text>

    <gov-section-break size="m" visible />

    <gov-heading size="l">Organiser details</gov-heading>

    <gov-body>
      Please provide the details of the event organiser if there is one. If
      there is not a specific organiser the contact details for the organisation
      will be used
    </gov-body>

    <gov-section-break size="l" />

    <ck-text-input
      :value="organiser_name"
      @input="onInput('organiser_name', $event)"
      id="organiser_name"
      label="Organiser name"
      :hint="
        `Provide the contact name (First name & Surname) for this event, or a generic entry if this isn’t applicable e.g. ‘Enquiries’, or ‘Helpdesk’.`
      "
      type="text"
      :error="errors.get('organiser_name')"
    />

    <ck-text-input
      :value="organiser_phone"
      @input="onInput('organiser_phone', $event)"
      id="organiser_phone"
      label="Organiser phone number"
      type="tel"
      :error="errors.get('organiser_phone')"
    >
      <template slot="hint">
        <gov-hint for="organiser_phone">
          Please provide a public facing phone number for attendees to contact
          you on.
        </gov-hint>
        <gov-hint for="organiser_phone">
          Please enter your phone number without any spaces, prefixes or special
          characters
        </gov-hint>
      </template>
    </ck-text-input>

    <ck-text-input
      :value="organiser_email"
      @input="onInput('organiser_email', $event)"
      id="organiser_email"
      label="Public organiser email address"
      hint="Please provide the contact email address for the event."
      type="email"
      :error="errors.get('organiser_email')"
    />

    <ck-text-input
      :value="organiser_url"
      @input="onInput('organiser_url', $event)"
      id="organiser_url"
      label="Public organiser web address"
      hint="This must start with 'http://' or 'https://'. Your organisation’s website address will be used if the event doesn't have its own."
      type="url"
      :error="errors.get('organiser_url')"
    />

    <gov-section-break size="m" visible />

    <gov-heading size="l">How to book</gov-heading>

    <gov-body>
      If your event requires booking, provide details of the booking process
      including a link to a booking facility. All fields must be filled if this
      is required.
    </gov-body>

    <ck-text-input
      :value="booking_title"
      @input="onInput('booking_title', $event)"
      id="booking_title"
      label="Title"
      hint="Label for the booking section, e.g. 'How to book'."
      type="text"
      :error="errors.get('booking_title')"
    />

    <ck-text-input
      :value="booking_summary"
      @input="onInput('booking_summary', $event)"
      id="booking_summary"
      label="Summary"
      hint="Describe the booking process so attendees will know what to expect."
      type="text"
      :error="errors.get('booking_summary')"
    />

    <ck-text-input
      :value="booking_url"
      @input="onInput('booking_url', $event)"
      id="booking_url"
      label="Booking web address"
      hint="This must start with 'http://' or 'https://'. This should be the link to the booking facility for the event."
      type="url"
      :error="errors.get('booking_url')"
    />

    <ck-text-input
      :value="booking_cta"
      @input="onInput('booking_cta', $event)"
      id="booking_cta"
      label="Button text"
      hint="The text that will be used for the booking button."
      type="text"
      :error="errors.get('booking_cta')"
    />

    <gov-section-break size="m" visible />

    <ck-radio-input
      :value="is_virtual"
      @input="onInput('is_virtual', $event)"
      id="is_virtual"
      label="Is the event virtual?*"
      :options="isVirtualOptions"
      :error="errors.get('is_virtual')"
    >
      <template slot="hint">
        <gov-hint for="is_virtual">
          Indicates whether your event occurs only online, or occurs at a
          location
        </gov-hint>
      </template>
    </ck-radio-input>

    <gov-inset-text v-if="is_virtual === false">
      <ck-location-input
        :location_id="location_id"
        @update:location_id="onInput('location_id', $event)"
        :error="errors.get('location_id')"
      />
    </gov-inset-text>

    <gov-section-break size="m" visible />

    <ck-image-input
      @input="onInput('image_file_id', $event.file_id)"
      @image-changed="$emit('image-changed', $event)"
      id="image"
      label="Event image"
      :file-id="image_file_id"
    />

    <event-homepage-input
      v-if="auth.isGlobalAdmin"
      :value="homepage"
      @input="onInput('homepage', $event)"
      id="homepage"
      label="Show the Event on the homepage*"
      :error="errors.get('homepage')"
    />
  </div>
</template>

<script>
import CkDatePicker from "@/components/Ck/CkDatePicker";
import CkImageInput from "@/components/Ck/CkImageInput";
import CkLocationInput from "@/components/Ck/CkLocationInput";
import CkTimePeriodInput from "@/components/Ck/CkTimePeriodInput";
import EventHomepageInput from "@/views/events/inputs/EventHomepageInput";

export default {
  name: "OrganisationEventDetailsTab",

  components: {
    CkDatePicker,
    CkImageInput,
    CkLocationInput,
    CkTimePeriodInput,
    EventHomepageInput
  },

  props: {
    errors: {
      required: true,
      type: Object
    },
    title: {
      required: true,
      type: String
    },
    slug: {
      type: String,
      required: true
    },
    intro: {
      required: true,
      type: String
    },
    description: {
      required: true,
      type: String
    },
    start_date: {
      required: true,
      type: String
    },
    end_date: {
      required: true,
      type: String
    },
    start_time: {
      required: true,
      type: String
    },
    end_time: {
      required: true,
      type: String
    },
    is_free: {
      required: true,
      type: Boolean
    },
    fees_text: {
      required: false,
      type: String
    },
    fees_url: {
      required: false,
      type: String
    },
    organiser_name: {
      required: false,
      type: String
    },
    organiser_phone: {
      required: false,
      type: String
    },
    organiser_email: {
      required: false,
      type: String
    },
    organiser_url: {
      required: false,
      type: String
    },
    booking_title: {
      required: false,
      type: String
    },
    booking_summary: {
      required: false,
      type: String
    },
    booking_url: {
      required: false,
      type: String
    },
    booking_cta: {
      required: false,
      type: String
    },
    is_virtual: {
      required: true,
      type: Boolean
    },
    organisation_id: {
      required: false,
      default: null
    },
    location_id: {
      required: false
    },
    image_file_id: {
      required: false
    },
    homepage: {
      required: true,
      type: Boolean
    },
    id: {
      required: false,
      type: String
    },
    organisations: {
      type: Array,
      required: false
    }
  },

  computed: {
    isFreeOptions() {
      return [
        { value: true, label: `Yes - The event is free` },
        {
          value: false,
          label: `No - there are elements of this event that must be paid for`
        }
      ];
    },
    isVirtualOptions() {
      return [
        { value: true, label: `Yes - The event is virtual` },
        {
          value: false,
          label: `No - the event occurs at a location`
        }
      ];
    },
    todayAsDate() {
      return this.dateToDateString(new Date());
    },
    earliestEndDate() {
      if (!this.start_date) {
        return this.todayAsDate;
      }
      const startDate = new Date(this.start_date);
      const today = new Date();
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);
      return today < startDate
        ? this.dateToDateString(startDate)
        : this.dateToDateString(today);
    }
  },

  methods: {
    onInput(field, value) {
      this.$emit(`update:${field}`, value);
      this.$emit("clear", field);
    },
    dateToDateString(dateObj) {
      return `${dateObj.getFullYear()}-${String(
        dateObj.getMonth() + 1
      ).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
    }
  },

  watch: {
    is_free(newIsFree) {
      if (newIsFree) {
        this.$emit("update:fees_text", "");
        this.$emit("update:fees_url", "");
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
