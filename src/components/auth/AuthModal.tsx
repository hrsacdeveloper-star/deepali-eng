import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/db/supabase';
import { toast } from 'sonner';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onOpenChange }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !contactNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: window.location.origin,
          data: {
            name,
            designation,
            contact_number: contactNumber
          }
        }
      });
      if (error) throw error;
      setOtpSent(true);
      toast.success('A 6-digit verification code was sent to your email.');
    } catch (error: any) {
      console.error('OTP send failed:', error);
      toast.error(error?.message || 'Failed to send verification code. Please check your Supabase email OTP settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !otp) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });
      if (error) throw error;
      
      // Upsert profile after successful verification
      if (data?.user) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: data.user.id,
          email,
          name,
          designation,
          contact_number: contactNumber,
          updated_at: new Date().toISOString()
        });
        if (profileError) {
          console.error('Failed to update profile:', profileError);
        }
      }
      
      toast.success('Successfully logged in & verified');
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Google sign-in failed:', error);
      toast.error(error?.message || 'Google login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] rounded-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-primary uppercase">
            {otpSent ? 'Enter Verification Code' : 'User Verification'}
          </DialogTitle>
          <DialogDescription>
            {otpSent 
              ? `We sent a 6-digit verification code to ${email}. Please enter it below.` 
              : 'Please verify your details to download catalogues and request quotes.'}
          </DialogDescription>
        </DialogHeader>
        
        {!otpSent ? (
          <form onSubmit={handleSendOTP} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-none border-border focus-visible:ring-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  placeholder="e.g. Procurement Manager"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="rounded-none border-border focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-none border-border focus-visible:ring-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <Input
                  id="contactNumber"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="rounded-none border-border focus-visible:ring-primary"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full rounded-none bg-primary hover:bg-primary/90 uppercase tracking-widest text-xs font-bold" disabled={loading}>
              {loading ? 'Sending Code...' : 'Send Verification Code'}
            </Button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">or login</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-red-500 bg-white text-red-600 shadow-sm transition hover:bg-red-50"
                onClick={handleGoogleSignIn}
                disabled={loading}
                aria-label="Continue with Google"
              >
                <span className="text-xl font-black">G</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="rounded-none border-border focus-visible:ring-primary text-center text-xl tracking-widest"
                required
              />
            </div>
            <Button type="submit" className="w-full rounded-none bg-primary hover:bg-primary/90 uppercase tracking-widest text-xs font-bold" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full rounded-none uppercase tracking-widest text-xs font-bold" 
              onClick={() => setOtpSent(false)}
            >
              Back to Details
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
