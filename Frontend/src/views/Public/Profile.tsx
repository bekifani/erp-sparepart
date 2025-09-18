import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Edit, 
  Save, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  MessageCircle,
  Globe
} from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name_surname: 'John Smith',
    shipping_mark: 'JS-AUTO-001',
    country: 'Azerbaijan',
    address: '123 Auto Parts Street, Baku, Azerbaijan',
    email: 'john.smith@email.com',
    phone_number: '+994 50 123 4567',
    whatsapp: '+994 50 123 4567',
    wechat_id: 'johnsmith_auto',
    additional_note: 'Preferred customer for premium automotive parts. Regular bulk orders.'
  });

  const handleSave = () => {
    setIsEditing(false);
    // In real app, would save to database
  };

  const handleCancel = () => {
    setIsEditing(false);
    // In real app, would reset to original data
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">User Profile</h1>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline" className="gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Picture & Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="text-center pb-3">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl">JS</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">{profileData.name_surname}</CardTitle>
              <CardDescription>
                <Badge variant="secondary" className="gap-1">
                  <User className="h-3 w-3" />
                  {profileData.shipping_mark}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {!isEditing && (
                <Button variant="outline" size="sm" className="w-full">
                  Change Photo
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Orders</span>
                <Badge variant="default">47</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Account Type</span>
                <Badge variant="secondary">Premium</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="text-sm font-medium">Jan 2024</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Full Name</label>
                  {isEditing ? (
                    <Input
                      value={profileData.name_surname}
                      onChange={(e) => setProfileData({...profileData, name_surname: e.target.value})}
                      placeholder="Enter full name"
                    />
                  ) : (
                    <p className="text-sm p-3 bg-muted rounded-md">{profileData.name_surname}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Shipping Mark</label>
                  {isEditing ? (
                    <Input
                      value={profileData.shipping_mark}
                      onChange={(e) => setProfileData({...profileData, shipping_mark: e.target.value})}
                      placeholder="Enter shipping mark"
                    />
                  ) : (
                    <p className="text-sm p-3 bg-muted rounded-md">{profileData.shipping_mark}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Country</label>
                  {isEditing ? (
                    <Input
                      value={profileData.country}
                      onChange={(e) => setProfileData({...profileData, country: e.target.value})}
                      placeholder="Enter country"
                    />
                  ) : (
                    <p className="text-sm p-3 bg-muted rounded-md">{profileData.country}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      placeholder="Enter email"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm p-3 bg-muted rounded-md">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {profileData.email}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Address</label>
                {isEditing ? (
                  <Textarea
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    placeholder="Enter full address"
                    rows={3}
                  />
                ) : (
                  <div className="flex items-start gap-2 text-sm p-3 bg-muted rounded-md">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    {profileData.address}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Phone Number</label>
                  {isEditing ? (
                    <Input
                      value={profileData.phone_number}
                      onChange={(e) => setProfileData({...profileData, phone_number: e.target.value})}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm p-3 bg-muted rounded-md">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {profileData.phone_number}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">WhatsApp</label>
                  {isEditing ? (
                    <Input
                      value={profileData.whatsapp}
                      onChange={(e) => setProfileData({...profileData, whatsapp: e.target.value})}
                      placeholder="Enter WhatsApp number"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm p-3 bg-muted rounded-md">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      {profileData.whatsapp}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">WeChat ID</label>
                  {isEditing ? (
                    <Input
                      value={profileData.wechat_id}
                      onChange={(e) => setProfileData({...profileData, wechat_id: e.target.value})}
                      placeholder="Enter WeChat ID"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm p-3 bg-muted rounded-md">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      {profileData.wechat_id}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
              <CardDescription>
                Any additional information or special requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={profileData.additional_note}
                  onChange={(e) => setProfileData({...profileData, additional_note: e.target.value})}
                  placeholder="Enter additional notes..."
                  rows={4}
                />
              ) : (
                <p className="text-sm p-3 bg-muted rounded-md">
                  {profileData.additional_note || 'No additional notes'}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;