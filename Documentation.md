# Documentation

### Required Permissions:
- Connect to an external service

### Note on editing existing webhook messages:
When I originally made this script, Google Script appeared to be unable to make Patch requests to Discord in the way that is necessary to edit webhook messages. This is something I have not yet found time to reinvestigate and correct in the code if this is no longer the case. One way around this is to have a website hosted elsewhere that can act as an intermediary. If you have access to such a page, and that page takes the patch data by means of a POST request with a payload of `{"POST_URL" : string , "payload" : Object}`, set its URL in the `patcherLink` variable at the top of the code to enable editing messages.

This code should still work fine for sending new webhook messages without this.

### `function sendWebhook(POST_URL, payload, messageID = false, thread_id = false)`

Sends a webhook to Discord. This method is used by the classes in this file which are designed to make constructing and sending webhooks easy. Using this method directly is not recommended.

 * **Parameters:**
   * `[POST_URL]` — `string` — URL of the webhook to send the message to.
   * `[payload]` — `Object` — Discord-compatible representation of a webhook message.
   * `[messageID=false]` — `string|boolean` — The ID of an existing webhook message to edit instead of sending a new message. False to send a new message. NOTE: This requires that the patcherLink variable has been set.
   * `[thread_id=false]` — `string|boolean` — The ID of an existing thread to send the webhook message to instead of sending it to the main channel. False to send in the main channel.
 * **Returns:** `HTTPResponse` — The response from the Discord Server.

## `class Webhook`

Represents a Discord Webhook message.

### Properties
| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| content | string | null | The content of the message. |

### `constructor(setUsername = false, setAvatar_url = false)`

Construct a new Webhook message.

 * **Parameters:**
   * `[setUsername=false]` — `string|boolean` — - Username to override displayed webhook username for this message. False to use the webhook's username.
   * `[avatar_url=false]` — `string|boolean` — - Url to avatar to override displayed webhook avatar for this message. False to use the webhook's avatar.

### `addEmbed(newEmbed)`

Adds an Embed object to the webhook.

 * **Parameters:** `[newEmbed]` — `Embed` — - The Embed.
 * **Returns:** `Webhook` — This Webhook object, for easy chaining.

### `payload()`

Constructs an Object representation of the webhook in a format suitable for sending to Discord via POST or PATCH request.

 * **Returns:** `Object` — POST or PATCH compatible representation of the Webhook.

### `send(POST_URL, messageID = false, thread_id = false)`

Send the webhook message.

 * **Parameters:**
   * `[POST_URL]` — `string` — URL of the webhook to send the message to.
   * `[messageID=false]` — `string|boolean` — The ID of an existing webhook message to edit instead of sending a new message. False to send a new message. NOTE: This requires that the patcherLink variable has been set.
   * `[thread_id=false]` — `string|boolean` — The ID of an existing thread to send the webhook message to instead of sending it to the main channel. False to send in the main channel.
 * **Returns:** `Webhook` — This Webhook object, for easy chaining.

## `class Embed`

Represents an Embed within a Webhook message. (A webhook can have 10 embeds per message)

### Properties
All properties of this class, with the exception of fields can be set to false to be omitted from the message.
| Name          | Type                | Default    | Description                                                                                            |
| :---          | :---                | :---       | :---                                                                                                   |
| title         | `string \| boolean` | `false`    | The text that is placed above the description, usually highlighted. Also directs to a URL, if given.   |
| description   | `string \| boolean` | `false`    | The part of the embed where most of the text is contained.                                             |
| url           | `string \| boolean` | `false`    | The url to hyperlink the title with.                                                                   |
| color         | `string \| boolean` | `false`    | Color of your embed’s border, in decimal.                                                              |
| fields        | `Field[]`           | `[]`       | Fields included in the Embed.                                                                          |
| authorName    | `string \| boolean` | `false`    | Name of Author to appear at top of Embed.                                                              |
| authorURL     | `string \| boolean` | `false`    | The url to hyperlink the author name with.                                                             |
| authorIconURL | `string \| boolean` | `false`    | URL of image to appear beside author name.                                                             |
| footerText    | `string \| boolean` | `false`    | Text at the bottom of the embed.                                                                       |
| footerIconURL | `string \| boolean` | `false`    | URL of icon to appear beside footer.                                                                   |
| timestamp     | `string \| boolean` | `false`    | Time that the embed was posted in the format of "YYYY-MM-DDTHH:MM:SS.MSSZ". Located next to the footer.|
| image_url     | `string \| boolean` | `false`    | URL of a large-sized image located below the “Description” element.                                    |
| thumb_url     | `string \| boolean` | `false`    | URL of a medium-sized image in the top right corner of the embed.                                      |

### `constructor()`

Construct a new Embed.

### `addField(newField = "** **", setValue = "** **", setInline = false)`

Adds a Field object to the Embed.

 * **Parameters:** `[newField]` — `Field` — - The Field.
 * **Returns:** `Embed` — This Embed object, for easy chaining.

### `payload()`

Constructs an Object representation of the Embed in a format suitable for sending to Discord via POST or PATCH request as part of a Webhook payload.

 * **Returns:** `Object` — POST or PATCH compatible representation of the Embed. (Still requires being within a Webhook)

### `send(POST_URL, messageID = false, thread_id = false)`

Send the embed as part of an otherwise blank webhook message.

 * **Parameters:**
   * `[POST_URL]` — `string` — URL of the webhook to send the message to.
   * `[messageID=false]` — `string|boolean` — The ID of an existing webhook message to edit instead of sending a new message. False to send a new message. NOTE: This requires that the patcherLink variable has been set.
   * `[thread_id=false]` — `string|boolean` — The ID of an existing thread to send the webhook message to instead of sending it to the main channel. False to send in the main channel.
 * **Returns:** `Webhook` — This Webhook object, for easy chaining.

## `class Field`

Represents a Field within an Embed. (An embed can contain a maximum of 25 fields)

### `constructor(setName = "** **", setValue = "** **", setInline = false)`

Construct a new Field.

 * **Parameters:**
   * `[setName="** **"]` — `string` — The text that is placed at the top of the Field in bold.
   * `[setValue="** **"]` — `string` — The body of the Field.
   * `[setInline="** **"]` — `string` — Whether to put this field in the same row as other fields, rather than having its own row.

### `payload()`

Constructs an Object representation of the Field in a format suitable for sending to Discord via POST or PATCH request as part of an Embed within a Webhook payload.

 * **Returns:** `Object` — POST or PATCH compatible representation of the Field. (Still requires being within an Embed & Webhook)
