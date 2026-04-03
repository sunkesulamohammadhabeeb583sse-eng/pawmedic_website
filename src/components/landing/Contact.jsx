import { Mail, Phone, MapPin, Send } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const Contact = () => {
    return (
        <section id="contact" className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Get In Touch
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                                <CardDescription>Reach out to us through any of these channels</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                        <Mail className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium">Email</div>
                                        <div className="text-gray-600">support@pawmedic.com</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                        <Phone className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium">Phone</div>
                                        <div className="text-gray-600">#9999888999</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                        <MapPin className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium">Office</div>
                                        <div className="text-gray-600">Chennai, Tamilnadu</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* FAQ Preview */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle>Frequently Asked Questions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="font-medium mb-1">Is PawMedic free to use?</div>
                                    <div className="text-sm text-gray-600">Yes, the basic features are completely free. Premium features available with subscription.</div>
                                </div>
                                <div>
                                    <div className="font-medium mb-1">How accurate is the AI disease detection?</div>
                                    <div className="text-sm text-gray-600">Our AI model has been trained on millions of images and achieves 99% accuracy in identifying common conditions.</div>
                                </div>
                                <div>
                                    <div className="font-medium mb-1">Is my data secure?</div>
                                    <div className="text-sm text-gray-600">Absolutely. We use bank-level encryption to protect all your pet's health data.</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle>Send us a Message</CardTitle>
                            <CardDescription>Fill out the form below and we'll get back to you</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">First Name</label>
                                        <Input placeholder="Habeeb" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Last Name</label>
                                        <Input placeholder="Doe" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <Input type="email" placeholder="habeeb@example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Subject</label>
                                    <Input placeholder="How can we help?" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Message</label>
                                    <textarea
                                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Tell us more about your question..."
                                    ></textarea>
                                </div>
                                <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Message
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

export default Contact
