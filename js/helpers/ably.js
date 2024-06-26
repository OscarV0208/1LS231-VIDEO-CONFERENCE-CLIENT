class AblyHelper {
    static channel = null;
    static room = null;

    static async connect(room, callback) {
        this.room = room;

        this.ably = new Ably.Realtime(CONFIG.Ably.apiKey);
        await this.ably.connection.once('connected');
        console.log('Connected to Ably!');

        // Get the channel to subscribe to
        this.channel = this.ably.channels.get(this.room);

        await this.channel.subscribe(callback);
    }

    static async send(data) {
        if (!this.channel) {
            console.error('You must connect to a room before sending data.');
            return;
        }
    
        const message = JSON.stringify(data);
    
        try {
            await new Promise((resolve, reject) => {
                this.channel.publish(this.room, message, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
            console.log('Message sent:', message);
        } catch (err) {
            console.error('Error sending message:', err);
        }
    }    
}
