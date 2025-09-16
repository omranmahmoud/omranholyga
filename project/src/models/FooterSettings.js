import mongoose from 'mongoose';

const footerSettingsSchema = new mongoose.Schema({
  description: {
    type: String,
    default: 'Discover luxury fashion that combines timeless elegance with modern style.'
  },
  address: {
    type: String,
    default: '123 Fashion Street, NY 10001'
  },
  phone: {
    type: String,
    default: '+1 (555) 123-4567'
  },
  email: {
    type: String,
    default: 'contact@evacurves.com'
  },
  socialLinks: {
    facebook: String,
    twitter: String,
    instagram: String,
    youtube: String
  },
  newsletter: {
    title: {
      type: String,
      default: 'Join Our Newsletter'
    },
    subtitle: {
      type: String,
      default: 'Subscribe to get special offers, free giveaways, and exclusive deals.'
    },
    placeholder: {
      type: String,
      default: 'Enter your email'
    },
    buttonText: {
      type: String,
      default: 'Subscribe'
    }
  }
}, {
  timestamps: true,
  collection: 'footer_settings' // Explicitly set collection name
});

// Create default settings if none exist
footerSettingsSchema.statics.createDefaultSettings = async function() {
  try {
    const settings = await this.findOne();
    if (!settings) {
      const defaultSettings = new this({});
      await defaultSettings.save();
      console.log('Default footer settings created successfully');
    }
  } catch (error) {
    console.error('Error creating default footer settings:', error);
    // Don't throw error to prevent app crash
  }
};

const FooterSettings = mongoose.models.FooterSettings || mongoose.model('FooterSettings', footerSettingsSchema);

// Create default settings when the model is initialized
FooterSettings.createDefaultSettings().catch(console.error);

export default FooterSettings;