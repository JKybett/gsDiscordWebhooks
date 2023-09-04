// Code for easily constructing and sending Webhooks to Discord from Google Sheets.
// Requires no other scripts to run.

// Google Script does not appear capable of sending Patch requests to Discord in the way that is necessary to edit webhook messages. One way around this is to have a website hosted elsewhere that can act as an intermediary. If you have access to such a page, and that page takes the patch data by means of a POST request with a payload of `{"POST_URL" : string , "payload" : Object}`, enter its URL in this variable to enable editing messages.
var patcherLink = false;

/**
 * Sends a webhook to Discord.
 * This method is used by the classes in this file which are designed to make constructing and sending webhooks easy. Using this method directly is not recommended.
 * 
 * @param {string} [POST_URL] URL of the webhook to send the message to.
 * @param {Object} [payload] Discord-compatible representation of a webhook message.
 * @param {string|boolean} [messageID=false] The ID of an existing webhook message to edit instead of sending a new message. False to send a new message. NOTE: This requires that the patcherLink variable has been set.
 * @param {string|boolean} [thread_id=false] The ID of an existing thread to send the webhook message to instead of sending it to the main channel. False to send in the main channel.
 * @returns {HTTPResponse} The response from the Discord Server.
 */
function sendWebhook(POST_URL, payload, messageID = false, thread_id = false){
  if(messageID && patcherLink){
    POST_URL = POST_URL+"/messages/"+messageID;
    var options = {
      "method": "post",
      "headers": {
        "Content-Type": "application/json",
      },
      "payload": JSON.stringify({"POST_URL" : POST_URL , "payload" : payload}),
      "muteHttpExceptions": true
    };
    var response = UrlFetchApp.fetch(patcherLink , options);
  } else {
    if(thread_id){
      POST_URL = POST_URL+"?thread_id="+thread_id;
    }
    var options = {
      "method": "post",
      "headers": {
        "Content-Type": "application/json",
      },
        "payload": JSON.stringify(payload) 
    };
    var response = UrlFetchApp.fetch(POST_URL, options);
    return response;
  }
}

/**
 * Represents a Discord Webhook message.
 * 
 */
class Webhook {
/**
 * Construct a new Webhook message.
 * @param {string|boolean} [setUsername=false] - Username to override displayed webhook username for this message. False to use the webhook's username.
 * @param {string|boolean} [avatar_url=false] - Url to avatar to override displayed webhook avatar for this message. False to use the webhook's avatar.
 */
  constructor(setUsername = false, setAvatar_url = false) {
    this.content = null;
    this.username = setUsername;
    this.avatar_url = setAvatar_url;
    this.embeds = [];
  }

/**
 * Adds an Embed object to the webhook.
 * @param {Embed} [newEmbed] - The Embed.
 * @returns {Webhook} This Webhook object, for easy chaining.
 */
  addEmbed(newEmbed) {
    this.embeds.push(newEmbed);
    return this;
  }

/**
 * Constructs an Object representation of the webhook in a format suitable for sending to Discord via POST or PATCH request.
 * @returns {Object} POST or PATCH compatible representation of the webhook.
 */
  payload(){
    var payload = {"content": this.content};
    if(this.embeds.length){
      var embedsForSend = [];
      for(let i = 0; i < this.embeds.length; i++){
        embedsForSend.push(this.embeds[i].payload())
      }
      payload.embeds = embedsForSend;
    }
    if(this.username){
      payload.username = this.username;
    }
    if(this.avatar_url){
      payload.avatar_url = this.avatar_url;
    }
    if(this.thread_name){
      payload.thread_name = this.thread_name;
    }
    if(this.thread_id){
      payload.thread_id = this.thread_id;
    }
    return payload;
  }

/**
 * Send the webhook message.
 * @param {string} [POST_URL] URL of the webhook to send the message to.
 * @param {string|boolean} [messageID=false] The ID of an existing webhook message to edit instead of sending a new message. False to send a new message. NOTE: This requires that the patcherLink variable has been set.
 * @param {string|boolean} [thread_id=false] The ID of an existing thread to send the webhook message to instead of sending it to the main channel. False to send in the main channel.
 * @returns {Webhook} This Webhook object, for easy chaining.
 */
  send(POST_URL, messageID = false, thread_id = false){
    var payload = this.payload();
    this.response = sendWebhook(POST_URL, payload, messageID, thread_id);
    return this;
  }

}

/**
 * Represents an Embed within a webhook message.
 * (A webhook can have 10 embeds per message)
 * 
 * All properties of this class, with the exception of fields can be set to false to be omitted from the message.
 * 
 * @property {string|boolean} [title		= false	] - The text that is placed above the description, usually highlighted. Also directs to a URL, if given.
 * @property {string|boolean} [description	= false	] - The part of the embed where most of the text is contained.
 * @property {string|boolean} [url			= false	] - The url to hyperlink the title with.
 * @property {string|boolean} [color		= false	] - Color of your embed’s border, in decimal.
 * @property {Field[]		} [fields		= []	] - Fields included in the Embed.
 * @property {string|boolean} [authorName 	= false	] - Name of Author to appear at top of Embed.
 * @property {string|boolean} [authorURL 	= false	] - The url to hyperlink the author name with.
 * @property {string|boolean} [authorIconURL= false	] - URL of image to appear beside author name. 
 * @property {string|boolean} [footerText 	= false	] - Text at the bottom of the embed.
 * @property {string|boolean} [footerIconURL= false	] - URL of icon to appear beside footer.
 * @property {string|boolean} [timestamp	= false	] - Time that the embed was posted in the format of "YYYY-MM-DDTHH:MM:SS.MSSZ". Located next to the footer.
 * @property {string|boolean} [image_url	= false	] - URL of a large-sized image located below the “Description” element.
 * @property {string|boolean} [thumb_url	= false	] - URL of a medium-sized image in the top right corner of the embed.
 */
class Embed {
/**
 * Construct a new Embed.
 */
  constructor(){
    this.title = false;
    this.description = false;
    this.url = false;
    this.color = false;
    this.fields = [];
	this.authorName = false;
	this.authorURL = false;
	this.authorIconURL = false;
	this.footerText = false;
	this.footerIconURL = false;
    this.timestamp = false;
    this.image_url = false; // "image": {image_url}
    this.thumb_url = false; // "thumbnail": {thumb_url}
  }

/**
 * Adds a Field object to the Embed.
 * @param {Field} [newField] - The Field.
 * @returns {Embed} This Embed object, for easy chaining.
 */
  addField(newField = "** **", setValue = "** **", setInline = false) {
    if(typeof newField == 'string'){
      newField = new Field(newField, setValue, setInline);
    }
    this.fields.push(newField);
    return this;
  }

/**
 * Constructs an Object representation of the Embed in a format suitable for sending to Discord via POST or PATCH request as part of a Webhook payload.
 * @returns {Object} POST or PATCH compatible representation of the Embed. (Still requires being within a Webhook)
 */
  payload(){
    var payload = {};
    if(this.title){
      payload.title = this.title;
    }
    if(this.description){
      payload.description = this.description;
    }
    if(this.url){
      payload.url = this.url;
    }
    if(this.color){
      payload.color = this.color;
    }
    //FIELDS
    if(this.fields.length){
      var fieldsForSend = [];
      for(let i = 0; i < this.fields.length; i++){
        fieldsForSend.push(this.fields[i].payload())
      }
      payload.fields = fieldsForSend;
    }
    //AUTHOR
    var payloadAuthor = {};
    if(this.authorName){
      payloadAuthor.name = this.authorName;
    }
    if(this.authorURL){
      payloadAuthor.url = this.authorURL;
    }
    if(this.authorIconURL){
      payloadAuthor.icon_url = this.authorIconURL;
    }
    if(Object.getOwnPropertyNames(payloadAuthor).length !== 0){
      payload.author = payloadAuthor;
    }
    //FOOTER
    var payloadFooter = {};
    if(this.footerText){
      payloadFooter.name = this.footerText;
    }
    if(this.footerIconURL){
      payloadFooter.icon_url = this.footerIconURL;
    }
    if(Object.getOwnPropertyNames(payloadFooter).length !== 0){
      payload.footer = payloadFooter;
    }
    //
    if(this.timestamp){
      payload.timestamp = this.timestamp;
    }
    if(this.image_url){
      payload.image = {"url" : this.image_url};
    }
    if(this.thumb_url){
      payload.thumbnail = {"url" : this.thumb_url};
    }
    return payload;
  }
  
/**
 * Send the embed as part of an otherwise blank webhook message.
 * @param {string} [POST_URL] URL of the webhook to send the message to.
 * @param {string|boolean} [messageID=false] The ID of an existing webhook message to edit instead of sending a new message. False to send a new message. NOTE: This requires that the patcherLink variable has been set.
 * @param {string|boolean} [thread_id=false] The ID of an existing thread to send the webhook message to instead of sending it to the main channel. False to send in the main channel.
 * @returns {Embed} This Embed object, for easy chaining.
 */
  send(POST_URL, messageID = false, thread_id = false){
    var webhook = new Webhook();
    webhook.addEmbed(this);
    webhook.send(POST_URL, messageID, thread_id);
    return this;
  }
}

/**
 * Represents a Field within an Embed.
 * (An embed can contain a maximum of 25 fields)
 */
class Field {
/**
 * Construct a new Field.
 * @param {string} [setName="** **"] - The text that is placed at the top of the Field in bold.
 * @param {string} [setValue="** **"] - The body of the Field.
 * @param {boolean} [setInline=false] - Whether to put this field in the same row as other fields, rather than having its own row.
 */
  constructor(setName = "** **", setValue = "** **", setInline = false) {
    this.name = setName;
    this.value = setValue;
    this.inline = setInline;
  }
  
/**
 * Constructs an Object representation of the Field in a format suitable for sending to Discord via POST or PATCH request as part of an Embed within a Webhook payload.
 * @returns {Object} POST or PATCH compatible representation of the Field. (Still requires being within an Embed & Webhook)
 */
  payload(){
    var payload = {"name": this.name, "value" : this.value};
    if(this.inline){
      payload.inline = this.inline;
    }
    return payload;
  }
}
