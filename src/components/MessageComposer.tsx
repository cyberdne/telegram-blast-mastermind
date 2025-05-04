
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { MessageTemplate, WatermarkSettings } from '@/utils/types';
import { mockMessageTemplates } from '@/utils/mockData';
import { formatDistanceToNow } from 'date-fns';

const commonEmojis = [
  "😀", "😊", "🔥", "✨", "💯", "🎉", "👍", "💪", "🚀", "💰", 
  "💎", "🎁", "⭐", "💥", "📢", "🔔", "📌", "🔖", "💡", "⏰",
  "✅", "⚡", "📱", "💻", "📊", "📈", "🔍", "✍️", "📝", "🎯",
  "🏆", "⚠️", "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍"
];

const premiumEmojis = [
  "🤩", "🥳", "😎", "🌟", "💫", "🌈", "🎭", "🎪", "🎨", "🎬", 
  "🎤", "🎧", "🎼", "🎵", "🎹", "🥁", "🎷", "🎸", "🎻", "🎺"
];

const MessageComposer: React.FC = () => {
  const [templates, setTemplates] = useState<MessageTemplate[]>(mockMessageTemplates);
  const [newTemplate, setNewTemplate] = useState<Partial<MessageTemplate>>({
    title: '',
    content: '',
    hasEmojis: false,
    hasMedia: false
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [watermarkSettings, setWatermarkSettings] = useState<WatermarkSettings>({
    enabled: true,
    text: "Sent via TeleBlast Pro",
    position: 'end'
  });

  const handleAddEmoji = (emoji: string) => {
    if (selectedTemplate) {
      const updatedTemplate = {
        ...selectedTemplate,
        content: selectedTemplate.content + emoji,
        hasEmojis: true
      };
      setSelectedTemplate(updatedTemplate);
      setTemplates(templates.map(t => t.id === selectedTemplate.id ? updatedTemplate : t));
    } else {
      setNewTemplate({
        ...newTemplate,
        content: (newTemplate.content || '') + emoji,
        hasEmojis: true
      });
    }
  };

  const handleSaveNewTemplate = () => {
    if (!newTemplate.title || !newTemplate.content) {
      toast({
        title: "Validation Error",
        description: "Both title and content are required.",
        variant: "destructive"
      });
      return;
    }

    const now = new Date().toISOString();
    const template: MessageTemplate = {
      id: `template-${Date.now()}`,
      title: newTemplate.title,
      content: newTemplate.content,
      hasEmojis: !!newTemplate.hasEmojis,
      hasMedia: !!newTemplate.hasMedia,
      mediaUrl: newTemplate.hasMedia ? '/placeholder.svg' : undefined,
      createdAt: now,
      updatedAt: now
    };

    setTemplates([...templates, template]);
    setNewTemplate({
      title: '',
      content: '',
      hasEmojis: false,
      hasMedia: false
    });
    setShowNewTemplate(false);
    
    toast({
      title: "Template Created",
      description: `"${template.title}" has been added to your templates.`,
    });
  };

  const handleUpdateTemplate = () => {
    if (!selectedTemplate) return;
    
    const updatedTemplate = {
      ...selectedTemplate,
      updatedAt: new Date().toISOString()
    };
    
    setTemplates(templates.map(t => t.id === selectedTemplate.id ? updatedTemplate : t));
    
    toast({
      title: "Template Updated",
      description: `"${selectedTemplate.title}" has been updated.`,
    });
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    setSelectedTemplate(null);
    
    toast({
      title: "Template Deleted",
      description: "The template has been deleted.",
    });
  };

  const getPreviewContent = (template: MessageTemplate) => {
    let content = template.content;
    
    if (watermarkSettings.enabled) {
      const watermark = `\n\n${watermarkSettings.text}`;
      content = watermarkSettings.position === 'start' 
        ? watermark + '\n\n' + content 
        : content + '\n\n' + watermark;
    }
    
    return content;
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Message Templates</h2>
        <Dialog open={showNewTemplate} onOpenChange={setShowNewTemplate}>
          <DialogTrigger asChild>
            <Button className="bg-promotion-primary hover:bg-promotion-primary/90">
              Create New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Message Template</DialogTitle>
              <DialogDescription>
                Design your promotional message template with text, emojis, and media.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid items-center gap-2">
                <Label htmlFor="title">Template Name</Label>
                <Input
                  id="title"
                  placeholder="e.g., Weekend Promotion"
                  value={newTemplate.title || ''}
                  onChange={(e) => setNewTemplate({...newTemplate, title: e.target.value})}
                />
              </div>
              
              <div className="grid items-center gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="content">Message Content</Label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    😊 Add Emoji
                  </Button>
                </div>
                
                <Textarea
                  id="content"
                  placeholder="Type your promotional message here..."
                  className="min-h-[120px]"
                  value={newTemplate.content || ''}
                  onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                />
                
                {showEmojiPicker && (
                  <Card className="mt-2">
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">Select Emoji</CardTitle>
                    </CardHeader>
                    <ScrollArea className="h-[150px]">
                      <CardContent className="p-3">
                        <div className="emoji-picker">
                          {commonEmojis.map(emoji => (
                            <div
                              key={emoji}
                              className="emoji-item"
                              onClick={() => handleAddEmoji(emoji)}
                            >
                              {emoji}
                            </div>
                          ))}
                          <div className="col-span-full mt-2">
                            <h4 className="text-sm font-semibold mb-2">Premium Emojis</h4>
                          </div>
                          {premiumEmojis.map(emoji => (
                            <div
                              key={emoji}
                              className="emoji-item"
                              onClick={() => handleAddEmoji(emoji)}
                            >
                              {emoji}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </ScrollArea>
                  </Card>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="media"
                  checked={newTemplate.hasMedia || false}
                  onCheckedChange={(checked) => setNewTemplate({...newTemplate, hasMedia: checked})}
                />
                <Label htmlFor="media">Include Media (Image/Video)</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewTemplate(false)}>Cancel</Button>
              <Button onClick={handleSaveNewTemplate}>Save Template</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Templates</CardTitle>
              <CardDescription>Select a template to edit or preview</CardDescription>
            </CardHeader>
            <CardContent>
              {templates.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {templates.map(template => (
                      <div
                        key={template.id}
                        className={`p-3 rounded-md cursor-pointer transition-colors ${
                          selectedTemplate?.id === template.id
                            ? "bg-primary/10 border border-primary/30"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => setSelectedTemplate(template)}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{template.title}</h3>
                          <div className="flex gap-1">
                            {template.hasEmojis && (
                              <Badge variant="outline">Emojis</Badge>
                            )}
                            {template.hasMedia && (
                              <Badge variant="outline">Media</Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {template.content}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Updated {formatDistanceToNow(new Date(template.updatedAt), { addSuffix: true })}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No templates found. Create your first template to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Watermark Settings</CardTitle>
              <CardDescription>Configure how your branding appears</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableWatermark"
                  checked={watermarkSettings.enabled}
                  onCheckedChange={(checked) => setWatermarkSettings({...watermarkSettings, enabled: checked})}
                />
                <Label htmlFor="enableWatermark">Enable Watermark</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="watermarkText">Watermark Text</Label>
                <Input
                  id="watermarkText"
                  value={watermarkSettings.text}
                  onChange={(e) => setWatermarkSettings({...watermarkSettings, text: e.target.value})}
                  disabled={!watermarkSettings.enabled}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Watermark Position</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="start"
                      name="position"
                      value="start"
                      checked={watermarkSettings.position === 'start'}
                      onChange={() => setWatermarkSettings({...watermarkSettings, position: 'start'})}
                      disabled={!watermarkSettings.enabled}
                    />
                    <Label htmlFor="start">Start of Message</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="end"
                      name="position"
                      value="end"
                      checked={watermarkSettings.position === 'end'}
                      onChange={() => setWatermarkSettings({...watermarkSettings, position: 'end'})}
                      disabled={!watermarkSettings.enabled}
                    />
                    <Label htmlFor="end">End of Message</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-7">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedTemplate 
                  ? `Edit: ${selectedTemplate.title}`
                  : "Template Editor"}
              </CardTitle>
              <CardDescription>
                {selectedTemplate
                  ? "Make changes to your selected template"
                  : "Select a template or create a new one"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedTemplate ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Template Name</Label>
                    <Input
                      id="edit-title"
                      value={selectedTemplate.title}
                      onChange={(e) => setSelectedTemplate({...selectedTemplate, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="edit-content">Message Content</Label>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      >
                        😊 Add Emoji
                      </Button>
                    </div>
                    
                    <Textarea
                      id="edit-content"
                      className="min-h-[120px]"
                      value={selectedTemplate.content}
                      onChange={(e) => setSelectedTemplate({...selectedTemplate, content: e.target.value})}
                    />
                    
                    {showEmojiPicker && (
                      <Card className="mt-2">
                        <CardHeader className="p-3">
                          <CardTitle className="text-sm">Select Emoji</CardTitle>
                        </CardHeader>
                        <ScrollArea className="h-[150px]">
                          <CardContent className="p-3">
                            <div className="emoji-picker">
                              {commonEmojis.map(emoji => (
                                <div
                                  key={emoji}
                                  className="emoji-item"
                                  onClick={() => handleAddEmoji(emoji)}
                                >
                                  {emoji}
                                </div>
                              ))}
                              <div className="col-span-full mt-2">
                                <h4 className="text-sm font-semibold mb-2">Premium Emojis</h4>
                              </div>
                              {premiumEmojis.map(emoji => (
                                <div
                                  key={emoji}
                                  className="emoji-item"
                                  onClick={() => handleAddEmoji(emoji)}
                                >
                                  {emoji}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </ScrollArea>
                      </Card>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-media"
                      checked={selectedTemplate.hasMedia}
                      onCheckedChange={(checked) => setSelectedTemplate({...selectedTemplate, hasMedia: checked})}
                    />
                    <Label htmlFor="edit-media">Include Media</Label>
                  </div>
                  
                  {selectedTemplate.hasMedia && (
                    <div className="space-y-2">
                      <Label>Media Preview</Label>
                      <div className="border rounded-md p-4 flex items-center justify-center">
                        <img 
                          src={selectedTemplate.mediaUrl || '/placeholder.svg'} 
                          alt="Media preview" 
                          className="max-h-[200px] object-contain"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2 pt-4">
                    <Label>Message Preview (with watermark settings applied)</Label>
                    <div className="border rounded-md p-4 bg-muted/30 whitespace-pre-wrap">
                      {getPreviewContent(selectedTemplate)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <div className="text-muted-foreground space-y-2">
                    <p>Select a template from the list to edit</p>
                    <p>or</p>
                    <Button 
                      onClick={() => setShowNewTemplate(true)}
                      className="mt-2"
                    >
                      Create New Template
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            {selectedTemplate && (
              <CardFooter className="flex justify-between border-t pt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Delete Template</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete "{selectedTemplate.title}"? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button variant="destructive" onClick={() => handleDeleteTemplate(selectedTemplate.id)}>
                        Delete Template
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button onClick={handleUpdateTemplate}>
                  Save Changes
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MessageComposer;
