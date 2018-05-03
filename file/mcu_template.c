/**
  * MCU SDK
  */

#define PRODUCT_ID "3154"

static device_func_info_t dev_upload_list[] = {
    UPLOAD_#TYPE#(#name#),
    UPLOAD_#TYPE#(#name#)
};

{% for item in items %}
{% endfor %}